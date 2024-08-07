import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { Box, Button } from '@mui/material';

import {
  DashboardTableProps,
  FullTeamSearchType,
  ParticipantDropdownOption,
} from 'modules/Dashboard/components';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { Svg } from 'shared/components';
import { variables } from 'shared/styles';

import { AssignmentsTableProps } from './AssignmentsTable.types';
import { StyledTable, StyledTableContainer } from './AssignmentsTable.styles';
import { AssignmentDropdown } from './AssignmentDropdown';
import { ActivityAssignment } from '../ActivityAssignDrawer.types';
import { getHeadCells } from './AssignmentsTable.utils';

export const AssignmentsTable = ({
  allParticipants,
  participantsOnly,
  fullAccountParticipantsAndTeamMembers,
  teamMembersOnly,
  handleSearch,
  assignments,
  onChange,
  isReadOnly,
  errors,
  'data-testid': dataTestId,
}: AssignmentsTableProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityAssign' });
  const {
    featureFlags: { enableParticipantMultiInformant },
  } = useFeatureFlags();
  const lastAssignment = assignments[assignments.length - 1];
  const showAddButton =
    !isReadOnly && lastAssignment?.respondentSubjectId && lastAssignment?.targetSubjectId;

  const handleChange = useCallback(
    ({ respondentSubjectId, targetSubjectId }: ActivityAssignment, index: number) => {
      const updatedAssignments = [...assignments];

      if (respondentSubjectId !== undefined || targetSubjectId !== undefined) {
        if (respondentSubjectId !== undefined) {
          // Set as self-assigned if newly selected respondent is a full account, and either:
          // - no target subject has been selected yet, or
          // - current assignment is a self-assignment (to preserve "Self" in the right column)
          const respondent = allParticipants.find(({ id }) => id === respondentSubjectId);
          if (respondent?.userId && !respondent.isTeamMember) {
            if (
              !assignments[index].targetSubjectId ||
              assignments[index].targetSubjectId === assignments[index].respondentSubjectId
            ) {
              updatedAssignments[index].targetSubjectId = respondentSubjectId;
            }
          }

          updatedAssignments[index].respondentSubjectId = respondentSubjectId;
        }
        if (targetSubjectId !== undefined) {
          updatedAssignments[index].targetSubjectId = targetSubjectId;
        }
        onChange(updatedAssignments);
      }
    },
    [allParticipants, assignments, onChange],
  );

  const handleAdd = useCallback(() => {
    onChange([...assignments, { respondentSubjectId: null, targetSubjectId: null }]);
  }, [assignments, onChange]);

  const handleRespondentSearch = useCallback(
    async (query: string) => {
      const participantSearchTypes: [FullTeamSearchType, ...FullTeamSearchType[]] = ['team'];
      if (enableParticipantMultiInformant) {
        participantSearchTypes.push('full-participant');
      }

      return handleSearch(query, participantSearchTypes);
    },
    [enableParticipantMultiInformant, handleSearch],
  );

  const handleSubjectSearch = useCallback(
    async (query: string, selfOption: ParticipantDropdownOption | null) => {
      const results = await handleSearch(query, ['any-participant']);

      if (selfOption) {
        // Filter out self option from search results as it's already included by the base options.
        return results.filter(({ id }) => id !== selfOption?.id);
      }

      return results;
    },
    [handleSearch],
  );

  const rows: DashboardTableProps['rows'] = useMemo(
    () =>
      assignments.map(({ respondentSubjectId, targetSubjectId }, index) => {
        const respondent =
          (respondentSubjectId && allParticipants.find(({ id }) => id === respondentSubjectId)) ||
          null;
        const subject =
          (targetSubjectId && allParticipants.find(({ id }) => id === targetSubjectId)) || null;

        const selfOption: ParticipantDropdownOption | null =
          respondent && !respondent.isTeamMember
            ? {
                ...respondent,
                nickname: undefined,
                tag: undefined,
                secretId: t('subjectSelf'),
              }
            : null;
        const subjectOptions = selfOption
          ? [selfOption, ...participantsOnly.filter(({ id }) => id !== selfOption.id)]
          : participantsOnly;
        const subjectValue = selfOption?.id === subject?.id ? selfOption : subject;

        const hasRowError = !!errors?.duplicateRows?.includes(
          `${respondentSubjectId}_${targetSubjectId}`,
        );

        return {
          rowState: { value: hasRowError && 'error' },
          respondentSubjectId: {
            value: respondentSubjectId ?? '',
            content: () => (
              <AssignmentDropdown
                placeholder={t('respondentPlaceholder')}
                isReadOnly={isReadOnly}
                value={respondent}
                options={
                  enableParticipantMultiInformant
                    ? fullAccountParticipantsAndTeamMembers
                    : teamMembersOnly
                }
                onChange={(value) =>
                  handleChange({ respondentSubjectId: value && value.id }, index)
                }
                handleSearch={handleRespondentSearch}
                showGroups
                emptyValueError={subjectValue && !subject?.userId ? t('addRespondent') : undefined}
                data-testid={`${dataTestId}-${index}-respondent-dropdown`}
              />
            ),
          },
          targetSubjectId: {
            value: targetSubjectId ?? '',
            content: () => (
              <AssignmentDropdown
                placeholder={t('subjectPlaceholder')}
                isReadOnly={isReadOnly}
                value={subjectValue}
                options={subjectOptions}
                onChange={(value) => handleChange({ targetSubjectId: value && value.id }, index)}
                handleSearch={(query) => handleSubjectSearch(query, selfOption)}
                groupBy={(option) => (option.id === selfOption?.id ? 'self' : 'other')}
                renderGroup={(params) => (
                  <Box
                    component="li"
                    key={params.key}
                    sx={{
                      '&:not(:last-child)': {
                        borderBottom: `${variables.borderWidth.md} solid ${variables.palette.surface_variant}`,
                      },
                    }}
                  >
                    <Box component="ul" sx={{ p: 0 }} {...params} />
                  </Box>
                )}
                data-testid={`${dataTestId}-${index}-target-subject-dropdown`}
              />
            ),
          },
        };
      }),
    [
      allParticipants,
      assignments,
      dataTestId,
      enableParticipantMultiInformant,
      errors?.duplicateRows,
      fullAccountParticipantsAndTeamMembers,
      handleChange,
      handleRespondentSearch,
      handleSubjectSearch,
      isReadOnly,
      participantsOnly,
      t,
      teamMembersOnly,
    ],
  );

  return (
    <StyledTableContainer>
      <StyledTable
        columns={getHeadCells()}
        rows={rows}
        enablePagination={false}
        handleRequestSort={() => {}}
        order="asc"
        orderBy="respondentSubjectId"
        data-testid={dataTestId}
      />
      {showAddButton && (
        <Button variant="textNeutral" onClick={handleAdd}>
          <Svg id="add" width={18} height={18} />
          {t('addRow')}
        </Button>
      )}
    </StyledTableContainer>
  );
};

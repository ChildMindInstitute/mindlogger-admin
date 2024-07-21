import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { Button } from '@mui/material';

import {
  DashboardTableProps,
  FullTeamSearchType,
  ParticipantDropdownOption,
} from 'modules/Dashboard/components';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { Svg } from 'shared/components';

import { AssignmentsTableProps } from './AssignmentsTable.types';
import { StyledTable, StyledTableContainer } from './AssignmentsTable.styles';
import { AssignmentDropdown } from './AssignmentDropdown';
import { ActivityAssignment } from '../ActivityAssignDrawer.types';
import { getHeadCells } from './AssignmentsTable.utils';

export const AssignmentsTable = ({
  allParticipants,
  participantsAndTeamMembers,
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
    !isReadOnly && lastAssignment.respondentSubjectId && lastAssignment.targetSubjectId;

  const handleChange = useCallback(
    ({ respondentSubjectId, targetSubjectId }: ActivityAssignment, index: number) => {
      const updatedAssignments = [...assignments];

      if (respondentSubjectId !== undefined || targetSubjectId !== undefined) {
        if (respondentSubjectId !== undefined) {
          // Set as self-assigned if:
          // - no target subject has been selected yet
          // - previous assignment was a self-assignment
          if (
            !assignments[index].targetSubjectId ||
            assignments[index].targetSubjectId === assignments[index].respondentSubjectId
          ) {
            updatedAssignments[index].targetSubjectId = respondentSubjectId;
          }

          updatedAssignments[index].respondentSubjectId = respondentSubjectId;
        }
        if (targetSubjectId !== undefined) {
          updatedAssignments[index].targetSubjectId = targetSubjectId;
        }
        onChange(updatedAssignments);
      }
    },
    [assignments, onChange],
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
      const results = await handleSearch(query, ['team', 'any-participant']);

      if (selfOption) {
        // Check search results for self option; if it's returned, make sure to replace
        // it in the list.
        const selfOptionIndex = results.findIndex(({ id }) => id === selfOption?.id);
        if (selfOptionIndex > -1) {
          results.splice(selfOptionIndex, 1, selfOption);
        }
        // If it wasn't found from the BE, but search text case-insentively matches
        // localized "Self" text, add it to top of list.
        else if (t('subjectSelf').toLowerCase().includes(query.toLowerCase())) {
          results.unshift(selfOption);
        }
      }

      return results;
    },
    [handleSearch, t],
  );

  const rows: DashboardTableProps['rows'] = useMemo(
    () =>
      assignments.map(({ respondentSubjectId, targetSubjectId }, index) => {
        const respondent =
          (respondentSubjectId && allParticipants.find(({ id }) => id === respondentSubjectId)) ||
          null;
        const subject =
          (targetSubjectId && allParticipants.find(({ id }) => id === targetSubjectId)) || null;

        const selfOption: ParticipantDropdownOption | null = respondent && {
          ...respondent,
          nickname: undefined,
          secretId: undefined,
          tag: undefined,
          [respondent.isTeamMember ? 'nickname' : 'secretId']: t('subjectSelf'),
        };
        const subjectOptions = selfOption
          ? participantsAndTeamMembers.map((option) =>
              option.id === selfOption?.id ? selfOption : option,
            )
          : participantsAndTeamMembers;
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
                emptyValueError={subjectValue ? t('addRespondent') : undefined}
                data-testid={`${dataTestId}-respondent-dropdown`}
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
                showGroups
                emptyValueError={respondent ? t('addSubject') : undefined}
                data-testid={`${dataTestId}-target-subject-dropdown`}
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
      participantsAndTeamMembers,
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

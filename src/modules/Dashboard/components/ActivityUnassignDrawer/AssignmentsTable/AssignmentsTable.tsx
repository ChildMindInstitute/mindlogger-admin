import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { Checkbox } from '@mui/material';

import { DashboardTableProps, ParticipantSnippet } from 'modules/Dashboard/components';
import { HydratedAssignment } from 'api';

import { AssignmentsTableProps } from './AssignmentsTable.types';
import { StyledTable } from './AssignmentsTable.styles';
import { getHeadCells } from './AssignmentsTable.utils';

export const AssignmentsTable = ({
  assignments,
  selected,
  onChange,
  'data-testid': dataTestId,
}: AssignmentsTableProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityUnassign' });

  const handleChange = useCallback(
    (assignment: HydratedAssignment, checked: boolean) => {
      const updatedAssignments = checked
        ? [...selected, assignment]
        : selected.filter((a) => a.id !== assignment.id);

      onChange?.(updatedAssignments);
    },
    [onChange, selected],
  );

  const rows: DashboardTableProps['rows'] = useMemo(
    () =>
      assignments
        .sort((a, b) => {
          // First, sort self-reports at the top of the list
          if (a.respondentSubject.id === a.targetSubject.id) {
            return -1;
          }
          if (b.respondentSubject.id === b.targetSubject.id) {
            return 1;
          }

          // Then sort by respondent nickname
          const respondentOrder = a.respondentSubject.nickname.localeCompare(
            b.respondentSubject.nickname,
          );
          if (respondentOrder !== 0) {
            return respondentOrder;
          }

          // Finally, sort by target subject nickname
          return a.targetSubject.nickname.localeCompare(b.targetSubject.nickname);
        })
        .map((assignment) => {
          const { id, respondentSubject, targetSubject } = assignment;

          const respondent = {
            ...respondentSubject,
            secretId: respondentSubject.secretUserId,
          };

          const target =
            respondentSubject.id === targetSubject.id
              ? {
                  ...targetSubject,
                  nickname: undefined,
                  tag: undefined,
                  secretId: t('subjectSelf'),
                }
              : {
                  ...targetSubject,
                  secretId: targetSubject.secretUserId,
                };

          return {
            id: {
              value: id,
              content: () => (
                <Checkbox
                  checked={selected.some((a) => a.id === id)}
                  onChange={({ target: { checked } }) => handleChange(assignment, checked)}
                  sx={{ p: 1.2, m: 0 }}
                  data-testid={`${dataTestId}-checkbox-${id}`}
                />
              ),
            },
            respondentSubject: {
              value: respondentSubject.id,
              content: () => (
                <ParticipantSnippet
                  {...respondent}
                  boxProps={{ sx: { px: 3.2, py: 0.8, width: '100%' } }}
                />
              ),
            },
            targetSubject: {
              value: targetSubject.id,
              content: () => (
                <ParticipantSnippet
                  {...target}
                  boxProps={{ sx: { px: 3.2, py: 0.8, width: '100%' } }}
                />
              ),
            },
          };
        }),
    [assignments, dataTestId, handleChange, selected, t],
  );

  return (
    <StyledTable
      columns={getHeadCells()}
      rows={rows}
      enablePagination={false}
      handleRequestSort={() => {}}
      order="asc"
      orderBy="id"
      data-testid={dataTestId}
    />
  );
};

import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Button } from '@mui/material';

import { ParticipantSnippet } from 'modules/Dashboard/components';
import { ActionsMenu, OptionalTooltipWrapper, Row, Svg } from 'shared/components';
import { StyledFlexTopCenter } from 'shared/styles';

import { ExpandedViewProps } from './ExpandedView.types';
import { getHeadCells } from './ExpandedView.utils';
import { StyledDashboardTable } from './ExpandedView.styles';

export const ExpandedView = ({
  activityOrFlow,
  targetSubjects = [],
  getActionsMenu,
  onClickViewData,
  'data-test-id': dataTestId,
}: ExpandedViewProps) => {
  const { t } = useTranslation('app');

  const rows: Row[] = useMemo(
    () =>
      targetSubjects.map(
        ({ submissionCount, currentlyAssigned, teamMemberCanViewData, ...subject }, index) => ({
          id: {
            value: subject.id,
            content: () => <ParticipantSnippet {...subject} secretId={subject.secretUserId} />,
          },
          submissionCount: {
            value: String(submissionCount),
            content: () => String(submissionCount),
          },
          currentlyAssigned: {
            value: String(currentlyAssigned),
            content: () => (currentlyAssigned ? t('yes') : t('no')),
          },
          actions: {
            value: '',
            content: () => {
              // Filter assignments attached to this activity/flow by target subject before
              // passing to `getActionsMenu()` so that the Unassign action only prompts user to
              // unassign for the specific target subject.
              const filteredActivityOrFlow = {
                ...activityOrFlow,
                assignments: activityOrFlow.assignments.filter(
                  ({ targetSubject }) => targetSubject.id === subject.id,
                ),
              };

              const tooltipTitle = teamMemberCanViewData ? '' : t('subjectDataUnavailable');

              return (
                <StyledFlexTopCenter sx={{ gap: 0.8 }}>
                  <OptionalTooltipWrapper tooltipTitle={tooltipTitle}>
                    {/* https://mui.com/material-ui/react-tooltip/#disabled-elements */}
                    <span>
                      <Button
                        variant="outlined"
                        onClick={() => onClickViewData(activityOrFlow, subject)}
                        sx={{ mr: 0.4 }}
                        data-testid={`${dataTestId}-subject-${index}-view-data`}
                        disabled={!teamMemberCanViewData}
                      >
                        <Svg id="chart" width="18" height="18" fill="currentColor" />
                        {t('viewData')}
                      </Button>
                    </span>
                  </OptionalTooltipWrapper>

                  <ActionsMenu
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: -6, horizontal: 'right' }}
                    buttonColor="secondary"
                    menuItems={getActionsMenu(filteredActivityOrFlow, subject)}
                    data-testid={`${dataTestId}-subject-${index}`}
                  />
                </StyledFlexTopCenter>
              );
            },
          },
        }),
      ),
    [activityOrFlow, dataTestId, getActionsMenu, onClickViewData, t, targetSubjects],
  );

  return (
    <StyledDashboardTable
      columns={getHeadCells()}
      rows={rows}
      keyExtractor={({ id }) => `row-${id.value}`}
      enablePagination={false}
      data-testid={dataTestId}
    />
  );
};

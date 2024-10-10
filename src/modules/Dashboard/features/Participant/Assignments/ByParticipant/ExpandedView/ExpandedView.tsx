import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Box, Button } from '@mui/material';

import { DashboardTable, ParticipantSnippet } from 'modules/Dashboard/components';
import { ActionsMenu, Row, Spinner, Svg } from 'shared/components';
import { StyledFlexTopCenter } from 'shared/styles';

import { ExpandedViewProps } from './ExpandedView.types';
import { getHeadCells } from './ExpandedView.utils';

export const ExpandedView = ({
  activityOrFlow,
  respondentSubject,
  targetSubjects = [],
  isLoading,
  onClickViewData,
  'data-test-id': dataTestId,
}: ExpandedViewProps) => {
  const { t } = useTranslation('app');

  const rows: Row[] = useMemo(
    () =>
      targetSubjects.map(({ submissionCount, currentlyAssigned, ...subject }, index) => ({
        id: {
          value: subject.id,
          content: () => <ParticipantSnippet {...subject} />,
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
          content: () => (
            <StyledFlexTopCenter sx={{ gap: 0.8 }}>
              <Button
                variant="outlined"
                onClick={() => onClickViewData(activityOrFlow, subject)}
                sx={{ mr: 0.4 }}
                data-testid={`${dataTestId}-${index}-view-data`}
              >
                <Svg id="chart" width="18" height="18" fill="currentColor" />
                {t('viewData')}
              </Button>
              <ActionsMenu
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: -6, horizontal: 'right' }}
                buttonColor="secondary"
                menuItems={[]}
                data-testid={`${dataTestId}-${index}`}
              />
            </StyledFlexTopCenter>
          ),
        },
      })),
    [activityOrFlow, dataTestId, onClickViewData, t, targetSubjects],
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {isLoading && <Spinner />}

      <DashboardTable
        columns={getHeadCells()}
        rows={rows}
        keyExtractor={({ id }) => `row-${id.value}`}
        enablePagination={false}
        data-testid={dataTestId}
      />
    </Box>
  );
};

import { memo } from 'react';

import { Spinner } from 'shared/components';
import { StyledFlexAllCenter } from 'shared/styles';

import { Report } from '../Report';
import { StyledEmptyReview } from '../RespondentDataSummary.styles';
import { getEmptyState } from './ReportContent.utils';
import { ReportContentProps } from './ReportContent.types';

export const ReportContent = memo(({ selectedActivity, isLoading }: ReportContentProps) => {
  if (selectedActivity && isLoading) return <Spinner />;
  if (!selectedActivity || selectedActivity.isPerformanceTask) {
    return (
      <StyledFlexAllCenter sx={{ height: '100%' }}>
        <StyledEmptyReview data-testid="summary-empty-state">
          {getEmptyState(selectedActivity)}
        </StyledEmptyReview>
      </StyledFlexAllCenter>
    );
  }

  return <Report />;
});

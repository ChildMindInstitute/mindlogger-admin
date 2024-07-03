import { memo } from 'react';

import { Spinner } from 'shared/components';
import { StyledFlexAllCenter } from 'shared/styles';

import { Report } from '../Report';
import { StyledEmptyReview } from '../RespondentDataSummary.styles';
import { ReportEmptyState } from './ReportEmptyState';
import { ReportContentProps } from './ReportContent.types';

export const ReportContent = memo(({ selectedEntity, isLoading }: ReportContentProps) => {
  if (selectedEntity && isLoading) return <Spinner />;
  if (!selectedEntity || selectedEntity.isPerformanceTask) {
    return (
      <StyledFlexAllCenter sx={{ height: '100%' }}>
        <StyledEmptyReview data-testid="summary-empty-state">
          <ReportEmptyState selectedEntity={selectedEntity} />
        </StyledEmptyReview>
      </StyledFlexAllCenter>
    );
  }

  return <Report />;
});

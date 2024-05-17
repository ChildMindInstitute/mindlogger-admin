import { StyledFlexAllCenter, StyledHeadlineLarge, theme } from 'shared/styles';
import { NotSupportedPerformanceTask } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/ReportContent/NotSupportedPerformanceTask';
import { StyledEmptyReview } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/RespondentDataSummary.styles';

import { ActivityResponses } from '../ActivityResponses';
import { FlowResponsesProps } from './FlowActivityResponses.types';
import { StyledFlowWrapper, StyledHeading } from './FlowActivityResponses.styles';
import { DownloadReport } from '../../DownloadReport';

export const FlowActivityResponses = ({
  activityId,
  activityName,
  isPerformanceTask,
  answers,
  versions,
  subscalesFrequency,
  responseOptions,
  'data-testid': dataTestId,
}: FlowResponsesProps) => (
  <StyledFlowWrapper data-testid={dataTestId}>
    <StyledHeading>
      <StyledHeadlineLarge sx={{ mr: theme.spacing(1) }}>{activityName}</StyledHeadlineLarge>
      {!isPerformanceTask && <DownloadReport id={activityId} isFlow={false} />}
    </StyledHeading>
    {isPerformanceTask ? (
      <StyledFlexAllCenter sx={{ mb: theme.spacing(4) }}>
        <StyledEmptyReview>
          <NotSupportedPerformanceTask />
        </StyledEmptyReview>
      </StyledFlexAllCenter>
    ) : (
      <ActivityResponses
        answers={answers}
        versions={versions}
        subscalesFrequency={subscalesFrequency}
        responseOptions={responseOptions}
        data-testid={`${dataTestId}-activity`}
      />
    )}
  </StyledFlowWrapper>
);

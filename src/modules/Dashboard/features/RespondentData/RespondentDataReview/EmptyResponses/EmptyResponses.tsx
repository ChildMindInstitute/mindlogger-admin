import { EmptyState } from './EmptyState';
import { StyledEmptyReview, StyledWrapper } from './EmptyResponses.styles';
import { EmptyResponsesProps } from './EmptyResponses.types';

export const EmptyResponses = ({
  hasAnswers,
  isActivityOrFlowSelected,
  isAnswerSelected,
  error,
  'data-testid': dataTestid,
}: EmptyResponsesProps) => {
  if (hasAnswers && isActivityOrFlowSelected && isAnswerSelected && !error) {
    return null;
  }

  return (
    <StyledWrapper data-testid={dataTestid}>
      <StyledEmptyReview>
        <EmptyState
          isAnswerSelected={isAnswerSelected}
          isActivityOrFlowSelected={isActivityOrFlowSelected}
          error={error}
        />
      </StyledEmptyReview>
    </StyledWrapper>
  );
};

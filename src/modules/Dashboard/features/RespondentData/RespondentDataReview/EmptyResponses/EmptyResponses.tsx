import { StyledEmptyReview, StyledWrapper } from './EmptyResponses.styles';
import { EmptyResponsesProps } from './EmptyResponses.types';
import { renderEmptyState } from './EmptyResponses.utils';

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
        {renderEmptyState({ isAnswerSelected, isActivityOrFlowSelected, error })}
      </StyledEmptyReview>
    </StyledWrapper>
  );
};

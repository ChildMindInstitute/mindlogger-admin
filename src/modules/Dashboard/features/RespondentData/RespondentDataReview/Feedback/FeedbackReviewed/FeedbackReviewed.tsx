import { StyledContainer } from './FeedbackReviewed.styles';
import { FeedbackReviewer } from './FeedbackReviewer';
import { mockedReviewers } from './mock';

export const FeedbackReviewed = () => {
  const reviewers = mockedReviewers;

  return (
    <StyledContainer>
      {reviewers.map((reviewer) => (
        <FeedbackReviewer key={String(reviewer.id)} reviewer={reviewer} />
      ))}
    </StyledContainer>
  );
};

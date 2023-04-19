import { Fragment } from 'react';

import { StyledContainer } from './FeedbackReviewed.styles';
import { FeedbackReviewer } from './FeedbackReviewer';
import { mockedReviewers } from './mock';

export const FeedbackReviewed = () => {
  const reviewers = mockedReviewers;

  return (
    <StyledContainer>
      {reviewers.map((reviewer) => (
        <Fragment key={reviewer.id}>
          <FeedbackReviewer reviewer={reviewer} />
        </Fragment>
      ))}
    </StyledContainer>
  );
};

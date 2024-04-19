import { Spinner } from 'shared/components';
import { StyledErrorText, theme } from 'shared/styles';

import { FeedbackReviewer } from '../FeedbackReviewer';
import { ReviewsProps } from './Reviews.types';

export const Reviews = ({
  isLoading,
  reviewsError,
  reviewersData,
  removeReviewError,
  removeReviewLoading,
  onReviewerAnswersRemove,
  'data-testid': dataTestid,
}: ReviewsProps) => {
  if (isLoading) return <Spinner />;

  if (reviewsError) {
    return <StyledErrorText sx={{ mt: theme.spacing(2) }}>{reviewsError}</StyledErrorText>;
  }

  if (reviewersData.length) {
    return (
      <>
        {reviewersData.map((reviewerData, index) => {
          const isCurrentUserReviewer = reviewerData.isCurrentUserReviewer;

          return (
            <FeedbackReviewer
              {...reviewerData}
              error={
                isCurrentUserReviewer && removeReviewError ? (
                  <StyledErrorText sx={{ mt: theme.spacing(2) }}>
                    {removeReviewError}
                  </StyledErrorText>
                ) : null
              }
              isLoading={isCurrentUserReviewer && removeReviewLoading}
              onReviewerAnswersRemove={onReviewerAnswersRemove}
              key={reviewerData.reviewer.id}
              data-testid={`${dataTestid}-reviewer-${index}`}
            />
          );
        })}
      </>
    );
  }

  return null;
};

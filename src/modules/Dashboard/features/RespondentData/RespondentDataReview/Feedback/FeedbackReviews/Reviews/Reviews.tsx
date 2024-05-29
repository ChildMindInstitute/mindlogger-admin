import { Spinner } from 'shared/components';
import { StyledErrorText, theme } from 'shared/styles';

import { FeedbackReviewer } from '../FeedbackReviewer';
import { ReviewsProps } from './Reviews.types';

export const Reviews = ({
  isLoading,
  reviewError,
  reviewerData,
  removeReviewError,
  removeReviewLoading,
  onReviewerAnswersRemove,
  onReviewEdit,
  'data-testid': dataTestid,
}: ReviewsProps) => {
  if (isLoading) return <Spinner />;

  if (reviewError) {
    return <StyledErrorText sx={{ mt: theme.spacing(2) }}>{reviewError}</StyledErrorText>;
  }

  if (reviewerData.length) {
    return (
      <>
        {reviewerData.map((reviewerData, index) => {
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
              onReviewEdit={onReviewEdit}
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

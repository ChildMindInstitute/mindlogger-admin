import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

import { AssessmentActivityItem } from '../../RespondentDataReview.types';
import { GetFeedbackReviewsProps, ReviewData } from './FeedbackReviews.types';

export const useFeedbackReviewsData = () => {
  const getDecryptedActivityData = useDecryptedActivityData();

  return async ({ reviews, userId }: GetFeedbackReviewsProps) => {
    const reviewsData: ReviewData[] = [];

    for await (const review of reviews) {
      const { reviewerPublicKey, reviewer, ...assessmentData } = review;
      const encryptedData = {
        ...assessmentData,
        userPublicKey: reviewerPublicKey,
      };

      const isCurrentUserReviewer = reviewer.id === userId;
      const { id, createdAt } = assessmentData;

      const decryptedReviewData = {
        reviewId: id,
        createdAt,
        isCurrentUserReviewer,
        reviewer,
        review: (await getDecryptedActivityData(encryptedData))
          .decryptedAnswers as AssessmentActivityItem[],
      };

      if (isCurrentUserReviewer) {
        reviewsData.unshift(decryptedReviewData);
      } else {
        reviewsData.push(decryptedReviewData);
      }
    }

    return reviewsData;
  };
};

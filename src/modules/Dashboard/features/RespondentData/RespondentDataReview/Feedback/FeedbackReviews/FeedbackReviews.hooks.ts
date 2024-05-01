import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

import { AssessmentActivityItem } from '../../RespondentDataReview.types';
import { GetFeedbackReviewsProps, ReviewData } from './FeedbackReviews.types';

export const useFeedbackReviewsData = () => {
  const getDecryptedActivityData = useDecryptedActivityData();

  return async ({ reviews, userId }: GetFeedbackReviewsProps) => {
    const reviewsData: ReviewData[] = [];

    for await (const review of reviews) {
      const { reviewerPublicKey, reviewer, answer, ...assessmentData } = review;
      const hasEncryptedData = !!reviewerPublicKey && !!answer;
      const encryptedData = hasEncryptedData && {
        ...assessmentData,
        answer,
        userPublicKey: reviewerPublicKey,
      };

      const isCurrentUserReviewer = reviewer.id === userId;
      const { id, updatedAt } = assessmentData;

      const decryptedReviewData = {
        reviewId: id,
        updatedAt,
        isCurrentUserReviewer,
        reviewer,
        review: encryptedData
          ? ((await getDecryptedActivityData(encryptedData))
              .decryptedAnswers as AssessmentActivityItem[])
          : null,
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

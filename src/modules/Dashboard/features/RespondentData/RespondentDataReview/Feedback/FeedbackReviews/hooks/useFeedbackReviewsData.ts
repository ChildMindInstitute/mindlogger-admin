import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

import { GetFeedbackReviewsProps, ReviewData } from '../FeedbackReviews.types';
import { AssessmentActivityItem } from '../../../RespondentDataReview.types';

export const useFeedbackReviewsData = () => {
  const getDecryptedActivityData = useDecryptedActivityData();

  const fetchReviewsData = async ({
    reviews,
    userId,
  }: GetFeedbackReviewsProps): Promise<ReviewData[]> => {
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

  return { fetchReviewsData };
};

import { AssessmentActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview';
import { EncryptedAnswerSharedProps } from 'shared/types';
import { Review as ReviewApi } from 'modules/Dashboard/api';

export type Review = EncryptedAnswerSharedProps & ReviewData;

export type ReviewData = {
  reviewId: string;
  updatedAt: string;
  isCurrentUserReviewer: boolean;
  reviewer: ReviewApi['reviewer'];
  review: AssessmentActivityItem[] | null;
};

export type GetFeedbackReviewsProps = { reviews: ReviewApi[]; userId: string };

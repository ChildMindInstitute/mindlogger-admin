import { AssessmentActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview';
import { EncryptedAnswerSharedProps } from 'shared/types';
import { Reviewer, Review as ReviewApi } from 'modules/Dashboard/api';

export type Review = EncryptedAnswerSharedProps & ReviewData;

export type ReviewData = {
  reviewId: string;
  createdAt: string;
  isCurrentUserReviewer: boolean;
  reviewer: Reviewer;
  review: AssessmentActivityItem[] | null;
};

export type GetFeedbackReviewsProps = { reviews: ReviewApi[]; userId: string };

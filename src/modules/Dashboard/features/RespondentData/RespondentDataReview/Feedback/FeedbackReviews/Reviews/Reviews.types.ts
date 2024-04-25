import { AssessmentId } from 'modules/Dashboard/api';

import { ReviewData } from '../FeedbackReviews.types';

export type OnReviewerAnswerRemove = ({ assessmentId }: AssessmentId) => Promise<void>;

export type ReviewsProps = {
  isLoading: boolean;
  reviewsError: string | null;
  reviewersData: ReviewData[];
  removeReviewError: string | null;
  removeReviewLoading: boolean;
  onReviewerAnswersRemove: OnReviewerAnswerRemove;
  onReviewEdit: () => void;
  'data-testid'?: string;
};

import { OnReviewerAnswersRemove } from '../FeedbackReviewer/FeedbackReviewer.types';
import { ReviewData } from '../FeedbackReviews.types';

export type ReviewsProps = {
  isLoading: boolean;
  reviewsError: string | null;
  reviewersData: ReviewData[];
  removeReviewError: string | null;
  removeReviewsLoading: boolean;
  onReviewerAnswersRemove: OnReviewerAnswersRemove;
  onReviewEdit: () => void;
  'data-testid'?: string;
};

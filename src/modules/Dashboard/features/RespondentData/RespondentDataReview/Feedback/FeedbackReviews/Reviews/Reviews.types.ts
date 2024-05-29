import { ReviewData } from '../FeedbackReviews.types';

export type ReviewsProps = {
  isLoading: boolean;
  reviewError: string | null;
  reviewerData: ReviewData[];
  removeReviewError: string | null;
  removeReviewLoading: boolean;
  onReviewerAnswersRemove: (assessmentId: string) => Promise<void>;
  onReviewEdit: () => void;
  'data-testid'?: string;
};

import { AssessmentId } from 'modules/Dashboard/api';

import { ReviewData } from '../FeedbackReviews.types';

export type ReviewsProps = {
  isLoading: boolean;
  reviewsError: string | null;
  reviewersData: ReviewData[];
  removeReviewError: string | null;
  removeReviewLoading: boolean;
  onReviewerAnswersRemove: ({ assessmentId }: AssessmentId) => Promise<void>;
  'data-testid'?: string;
};

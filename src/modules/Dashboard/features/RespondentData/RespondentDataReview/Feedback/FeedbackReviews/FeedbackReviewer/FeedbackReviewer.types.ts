import { ReactNode } from 'react';

import { ReviewData } from '../FeedbackReviews.types';

export type OnReviewerAnswersRemove = (reviewId: string) => Promise<void>;

export type FeedbackReviewerProps = ReviewData & {
  onReviewerAnswersRemove: OnReviewerAnswersRemove;
  onReviewEdit: () => void;
  error: ReactNode | null;
  isLoading: boolean;
  'data-testid'?: string;
};

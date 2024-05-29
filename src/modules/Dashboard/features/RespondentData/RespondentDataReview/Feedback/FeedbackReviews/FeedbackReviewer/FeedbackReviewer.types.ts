import { ReactNode } from 'react';

import { ReviewData } from '../FeedbackReviews.types';

export type FeedbackReviewerProps = ReviewData & {
  onReviewerAnswersRemove: (assessmentId: string) => Promise<void>;
  onReviewEdit: () => void;
  error: ReactNode | null;
  isLoading: boolean;
  'data-testid'?: string;
};

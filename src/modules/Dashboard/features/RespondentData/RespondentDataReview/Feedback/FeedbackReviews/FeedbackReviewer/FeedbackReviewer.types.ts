import { ReactNode } from 'react';

import { OnReviewerAnswerRemove } from '../Reviews/Reviews.types';
import { ReviewData } from '../FeedbackReviews.types';

export type FeedbackReviewerProps = ReviewData & {
  onReviewerAnswersRemove: OnReviewerAnswerRemove;
  onReviewEdit: () => void;
  error: ReactNode | null;
  isLoading: boolean;
  'data-testid'?: string;
};

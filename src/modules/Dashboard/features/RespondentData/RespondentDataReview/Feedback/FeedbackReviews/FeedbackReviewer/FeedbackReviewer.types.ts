import { ReactNode } from 'react';

import { AssessmentId } from 'modules/Dashboard/api';

import { ReviewData } from '../FeedbackReviews.types';

export type FeedbackReviewerProps = ReviewData & {
  onReviewerAnswersRemove: ({ assessmentId }: AssessmentId) => Promise<void>;
  error: ReactNode | null;
  isLoading: boolean;
  'data-testid'?: string;
};

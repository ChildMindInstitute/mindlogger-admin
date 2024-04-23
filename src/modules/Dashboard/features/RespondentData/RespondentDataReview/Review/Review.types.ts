import { ActivityItemAnswers, Answer } from '../RespondentDataReview.types';

export type ReviewProps = {
  isLoading: boolean;
  selectedAnswer: Answer | null;
  activityItemAnswers: ActivityItemAnswers;
  isActivitySelected: boolean;
  'data-testid'?: string;
};

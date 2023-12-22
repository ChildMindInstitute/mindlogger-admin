import { DecryptedActivityData, EncryptedAnswerSharedProps } from 'shared/types';

import { Answer } from '../RespondentDataReview.types';

export type ReviewProps = {
  isLoading: boolean;
  selectedAnswer: Answer | null;
  activityItemAnswers: DecryptedActivityData<EncryptedAnswerSharedProps>['decryptedAnswers'] | null;
  'data-testid'?: string;
};

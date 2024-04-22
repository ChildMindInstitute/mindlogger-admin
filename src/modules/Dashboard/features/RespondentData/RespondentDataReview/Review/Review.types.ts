import { DecryptedActivityData } from 'shared/types';
import { EncryptedActivityAnswer } from 'modules/Dashboard/api';

import { Answer } from '../RespondentDataReview.types';

export type ReviewProps = {
  isLoading: boolean;
  selectedAnswer: Answer | null;
  activityItemAnswers:
    | DecryptedActivityData<EncryptedActivityAnswer['answer']>['decryptedAnswers']
    | null;
  isActivitySelected: boolean;
  'data-testid'?: string;
};

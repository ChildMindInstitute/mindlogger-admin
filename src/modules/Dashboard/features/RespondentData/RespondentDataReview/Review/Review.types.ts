import { DecryptedActivityData, EncryptedAnswerSharedProps } from 'shared/types';

export type ReviewProps = {
  activityItemAnswers: DecryptedActivityData<EncryptedAnswerSharedProps>['decryptedAnswers'];
  'data-testid'?: string;
};

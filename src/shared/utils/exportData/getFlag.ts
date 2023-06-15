import { DecryptedAnswerData } from 'shared/types';

export const getFlag = (item: DecryptedAnswerData) => {
  if (item.scheduledDatetime && !item.startDatetime) {
    return 'missed';
  }

  return 'completed';
};

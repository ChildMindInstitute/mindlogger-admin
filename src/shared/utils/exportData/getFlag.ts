import { ActivityStatus } from 'shared/consts';
import { DecryptedAnswerData } from 'shared/types';

export const getFlag = (item: DecryptedAnswerData) => {
  if (item.scheduledDatetime && !item.startDatetime) {
    return ActivityStatus.Missed;
  }

  return ActivityStatus.Completed;
};

import { ActivityStatus } from 'shared/consts';
import { DecryptedAnswerData, ExportAnswer } from 'shared/types';

export const getFlag = (item: DecryptedAnswerData<ExportAnswer>) => {
  if (item.scheduledDatetime && !item.startDatetime) {
    return ActivityStatus.Missed;
  }

  return ActivityStatus.Completed;
};

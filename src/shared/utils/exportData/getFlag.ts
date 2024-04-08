import { ActivityStatus } from 'shared/consts';
import { DecryptedABTrailsAnswer, DecryptedAnswerData } from 'shared/types';
import { ItemResponseType } from 'shared/consts';

export const getFlag = (item: DecryptedAnswerData) => {
  if (item.scheduledDatetime && !item.startDatetime) {
    return ActivityStatus.Missed;
  }

  const { responseType } = item.activityItem;
  switch (responseType) {
    case ItemResponseType.ABTrails: {
      const answer = item.answer as DecryptedABTrailsAnswer;
      const isIncompleteCondition =
        !answer?.value ||
        (answer.value.maximumIndex && answer.value.currentIndex !== answer.value.maximumIndex);
      if (isIncompleteCondition) return ActivityStatus.Incomplete;

      return ActivityStatus.Completed;
    }
    default:
      return ActivityStatus.Completed;
  }
};

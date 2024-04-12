import { DatavizActivity } from 'modules/Dashboard/api';

export const getActivityWithLatestAnswer = (
  activities: DatavizActivity[],
): DatavizActivity | null =>
  activities?.reduce((prev: null | DatavizActivity, current) => {
    if (!current.hasAnswer || !current.lastAnswerDate) {
      return prev;
    }

    if (!prev || (prev?.lastAnswerDate && prev.lastAnswerDate < current.lastAnswerDate)) {
      return current;
    }

    return prev;
  }, null);

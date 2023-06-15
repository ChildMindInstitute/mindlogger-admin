import { DecryptedAnswerData } from 'shared/types';
import { SingleAndMultipleSelectItemResponseValues } from 'shared/state';

import { parseResponseValue } from './parseResponseValue';
import { getFlag } from './getFlag';
import { parseOptions } from './parseOptions';

export const getReportCSVObject = (item: DecryptedAnswerData) => {
  const {
    answer,
    activityItem,
    scheduledDatetime,
    startDatetime,
    endDatetime,
    respondentSecretId,
    respondentId,
    activityId,
    activityName,
    flowId,
    version,
    reviewedAnswerId,
  } = item;

  const responseValues = activityItem?.responseValues as SingleAndMultipleSelectItemResponseValues;

  return {
    id: item.id,
    activity_scheduled_time: scheduledDatetime || 'not scheduled',
    activity_start_time: startDatetime,
    activity_end_time: endDatetime,
    flag: getFlag(item),
    secret_user_id: respondentSecretId,
    userId: respondentId,
    activity_id: activityId,
    activity_name: activityName,
    activity_flow: flowId,
    item: activityItem.name,
    response: parseResponseValue(answer, item.activityItem?.responseType),
    prompt: activityItem.question?.en,
    options: parseOptions(responseValues),
    version,
    rawScore: '',
    reviewing_id: reviewedAnswerId,
  };
};

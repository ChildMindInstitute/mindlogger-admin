import { DecryptedAnswerData } from 'shared/types';
import { SingleAndMultipleSelectItemResponseValues, SliderItemResponseValues } from 'shared/state';
import { ActivityStatus } from 'shared/consts';
import { parseResponseValue } from './parseResponseValue';

import { getFlag } from './getFlag';
import { parseOptions } from './parseOptions';
import { getRawScores } from './getRowScores';
import { getSubscales } from './getSubscales';

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
    subscaleSetting,
  } = item;

  const responseValues = activityItem?.responseValues as SingleAndMultipleSelectItemResponseValues &
    SliderItemResponseValues;

  return {
    id: item.id,
    activity_scheduled_time: scheduledDatetime || ActivityStatus.NotSheduled,
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
    options: parseOptions(responseValues, item.activityItem?.responseType),
    version,
    rawScore: getRawScores(responseValues) || '',
    reviewing_id: reviewedAnswerId,
    ...getSubscales(subscaleSetting?.subscales),
    ...(subscaleSetting?.calculateTotalScore && {
      'Final SubScale Score': subscaleSetting.calculateTotalScore,
    }),
    ...(subscaleSetting?.totalScoresTableData && {
      'Optional text for Final SubScale Score': subscaleSetting.totalScoresTableData,
    }),
  };
};

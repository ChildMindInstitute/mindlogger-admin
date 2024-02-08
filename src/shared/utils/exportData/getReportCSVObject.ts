import { ActivityStatus } from 'shared/consts';
import { SingleAndMultipleSelectItemResponseValues, SliderItemResponseValues } from 'shared/state';
import { AnswerDTO, DecryptedAnswerData } from 'shared/types';
import { getDictionaryText } from 'shared/utils/forms';

import { convertDateStampToMs } from './convertDateStampToMs';
import { getFlag } from './getFlag';
import { getRawScores } from './getRawScores';
import { parseOptions } from './parseOptions';
import { parseResponseValue } from './parseResponseValue';
import { replaceItemVariableWithName } from './replaceItemVariableWithName';

export const getReportCSVObject = <T>({
  item,
  rawAnswersObject,
  index,
}: {
  item: DecryptedAnswerData;
  rawAnswersObject: Record<string, T & { answer: AnswerDTO }>;
  index: number;
}) => {
  const {
    activityItem,
    scheduledDatetime,
    startDatetime,
    endDatetime,
    respondentSecretId,
    respondentId,
    activityId,
    activityName,
    flowName,
    version,
    reviewedAnswerId,
    legacyProfileId,
  } = item;
  const responseValues = activityItem?.responseValues as SingleAndMultipleSelectItemResponseValues &
    SliderItemResponseValues;

  return {
    id: item.id,
    activity_scheduled_time: scheduledDatetime ? convertDateStampToMs(scheduledDatetime) : ActivityStatus.NotScheduled,
    activity_start_time: convertDateStampToMs(startDatetime),
    activity_end_time: convertDateStampToMs(endDatetime),
    flag: getFlag(item),
    secret_user_id: respondentSecretId,
    userId: respondentId,
    activity_id: activityId,
    activity_name: activityName,
    activity_flow: flowName,
    item: activityItem.name,
    response: parseResponseValue(item, index),
    prompt: replaceItemVariableWithName({
      markdown: getDictionaryText(activityItem.question),
      items: item.items,
      rawAnswersObject,
    }),
    options: replaceItemVariableWithName({
      markdown: parseOptions(responseValues, item.activityItem?.responseType) ?? '',
      items: item.items,
      rawAnswersObject,
    }),
    version,
    rawScore: getRawScores(responseValues) || '',
    reviewing_id: reviewedAnswerId,
    ...(legacyProfileId && { legacy_user_id: legacyProfileId }),
  };
};

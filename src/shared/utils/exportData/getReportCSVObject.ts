import { AnswerDTO, DecryptedAnswerData } from 'shared/types';
import { SingleAndMultipleSelectItemResponseValues, SliderItemResponseValues } from 'shared/state';
import { ActivityStatus } from 'shared/consts';
import { getDictionaryText } from 'shared/utils/forms';

import { replaceItemVariableWithName } from './replaceItemVariableWithName';
import { parseResponseValue } from './parseResponseValue';
import { getFlag } from './getFlag';
import { parseOptions } from './parseOptions';
import { getRawScores } from './getRawScores';
import { convertDateStampToMs } from './convertDateStampToMs';

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
    sourceSubjectId,
    targetSubjectId,
    activityId,
    activityName,
    flowId,
    flowName,
    version,
    reviewedAnswerId,
    legacyProfileId,
    scheduledEventId,
    tzOffset,
  } = item;
  const responseValues = activityItem?.responseValues as SingleAndMultipleSelectItemResponseValues &
    SliderItemResponseValues;

  return {
    id: item.id,
    activity_scheduled_time: scheduledDatetime
      ? convertDateStampToMs(scheduledDatetime)
      : ActivityStatus.NotScheduled,
    activity_start_time: convertDateStampToMs(startDatetime),
    activity_end_time: convertDateStampToMs(endDatetime),
    flag: getFlag(item),
    secret_user_id: respondentSecretId ?? '',
    userId: respondentId ?? '',
    source_subject_id: sourceSubjectId ?? '',
    target_subject_id: targetSubjectId ?? '',
    activity_id: activityId,
    activity_name: activityName,
    activity_flow_id: flowId ?? '',
    activity_flow_name: flowName ?? '',
    item: activityItem.name,
    item_id: activityItem.id ?? '',
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
    version: version ?? '',
    rawScore: getRawScores(responseValues) || '',
    reviewing_id: reviewedAnswerId ?? '',
    ...(legacyProfileId && { legacy_user_id: legacyProfileId }),
    event_id: scheduledEventId ?? '',
    timezone_offset: tzOffset ?? '',
  };
};

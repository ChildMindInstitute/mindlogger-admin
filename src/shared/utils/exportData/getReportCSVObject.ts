import {
  AnswerDTO,
  DecryptedAnswerData,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types';
import { SingleAndMultipleSelectItemResponseValues, SliderItemResponseValues } from 'shared/state';
import { ActivityStatus } from 'shared/consts';
import { replaceItemVariableWithName } from 'shared/utils/exportData';

import { parseResponseValue } from './parseResponseValue';
import { getFlag } from './getFlag';
import { parseOptions } from './parseOptions';
import { getRawScores } from './getRowScores';

export const getReportCSVObject = <T>({
  item,
  rawAnswersObject,
}: {
  item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>;
  rawAnswersObject: Record<string, T & { answer: AnswerDTO }>;
}) => {
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

  const responseValues = activityItem?.responseValues as SingleAndMultipleSelectItemResponseValues &
    SliderItemResponseValues;

  return {
    id: item.id,
    activity_scheduled_time: scheduledDatetime || ActivityStatus.NotScheduled,
    activity_start_time: startDatetime,
    activity_end_time: endDatetime,
    flag: getFlag(item),
    secret_user_id: respondentSecretId,
    userId: respondentId,
    activity_id: activityId,
    activity_name: activityName,
    activity_flow: flowId,
    item: activityItem.name,
    response: parseResponseValue(answer, item.activityItem, item.id),
    prompt: replaceItemVariableWithName({
      markdown: activityItem.question?.en ?? '',
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
  };
};

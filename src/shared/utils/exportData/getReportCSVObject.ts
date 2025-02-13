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
  enableDataExportRenaming,
}: {
  item: DecryptedAnswerData;
  rawAnswersObject: Record<string, T & { answer: AnswerDTO }>;
  index: number;
  enableDataExportRenaming: boolean;
}) => {
  const {
    activityItem,
    scheduledDatetime,
    startDatetime,
    endDatetime,
    respondentSecretId,
    respondentId,
    sourceSubjectId,
    sourceSecretId,
    sourceUserNickname,
    sourceUserTag,
    targetSubjectId,
    targetSecretId,
    targetUserNickname,
    targetUserTag,
    inputSubjectId,
    inputSecretId,
    inputUserNickname,
    relation,
    activityId,
    activityName,
    flowId,
    flowName,
    version,
    reviewedAnswerId,
    reviewedFlowSubmitId,
    legacyProfileId,
    scheduledEventId,
    tzOffset,
    submitId,
  } = item;
  const responseValues = activityItem?.responseValues as SingleAndMultipleSelectItemResponseValues &
    SliderItemResponseValues;

  return enableDataExportRenaming
    ? {
        target_id: targetSubjectId ?? '',
        target_secret_id: targetSecretId ?? '',
        target_nickname: targetUserNickname ?? '',
        target_tag: targetUserTag ?? '',
        source_id: sourceSubjectId ?? '',
        source_secret_id: sourceSecretId ?? '',
        source_nickname: sourceUserNickname ?? '',
        source_tag: sourceUserTag ?? '',
        source_relation: relation ?? '',
        input_id: inputSubjectId ?? '',
        input_secret_id: inputSecretId ?? '',
        input_nickname: inputUserNickname ?? '',
        userId: respondentId ?? '',
        secret_user_id: respondentSecretId ?? '',
        legacy_user_id: legacyProfileId ?? '',

        applet_version: version ?? '',
        activity_flow_id: flowId ?? '',
        activity_flow_name: flowName ?? '',
        activity_flow_submission_id: flowId && !reviewedFlowSubmitId ? submitId : '',
        activity_id: activityId,
        activity_name: activityName,
        activity_submission_id: item.id,
        activity_start_time: convertDateStampToMs(startDatetime),
        activity_end_time: convertDateStampToMs(endDatetime),
        activity_schedule_id: scheduledEventId ?? '',
        activity_schedule_start_time: scheduledDatetime
          ? convertDateStampToMs(scheduledDatetime)
          : ActivityStatus.NotScheduled,
        utc_timezone_offset: tzOffset ?? '',
        activity_submission_review_id: reviewedFlowSubmitId ?? reviewedAnswerId ?? '',

        item_id: activityItem.id ?? '',
        item_name: activityItem.name,
        item_prompt: replaceItemVariableWithName({
          markdown: getDictionaryText(activityItem.question),
          items: item.items,
          rawAnswersObject,
        }),
        item_response_options: replaceItemVariableWithName({
          markdown: parseOptions(responseValues, item.activityItem?.responseType) ?? '',
          items: item.items,
          rawAnswersObject,
        }),
        item_response: parseResponseValue(item, index),
        item_response_status: getFlag(item),

        rawScore: getRawScores(responseValues) || '',
      }
    : {
        id: item.id,
        activity_flow_submission_id: flowId && !reviewedFlowSubmitId ? submitId : '',
        activity_scheduled_time: scheduledDatetime
          ? convertDateStampToMs(scheduledDatetime)
          : ActivityStatus.NotScheduled,
        activity_start_time: convertDateStampToMs(startDatetime),
        activity_end_time: convertDateStampToMs(endDatetime),
        flag: getFlag(item),
        secret_user_id: respondentSecretId ?? '',
        userId: respondentId ?? '',
        source_user_subject_id: sourceSubjectId ?? '',
        source_user_secret_id: sourceSecretId ?? '',
        source_user_nickname: sourceUserNickname ?? '',
        source_user_relation: relation ?? '',
        source_user_tag: sourceUserTag ?? '',
        target_user_subject_id: targetSubjectId ?? '',
        target_user_secret_id: targetSecretId ?? '',
        target_user_nickname: targetUserNickname ?? '',
        target_user_tag: targetUserTag ?? '',
        input_user_subject_id: inputSubjectId ?? '',
        input_user_secret_id: inputSecretId ?? '',
        input_user_nickname: inputUserNickname ?? '',
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
        reviewing_id: reviewedFlowSubmitId ?? reviewedAnswerId ?? '',
        event_id: scheduledEventId ?? '',
        timezone_offset: tzOffset ?? '',
        legacy_user_id: legacyProfileId ?? '',
      };
};

import { SingleAndMultipleSelectItemResponseValues, SliderItemResponseValues } from 'shared/state';
import { ActivityStatus } from 'shared/consts';
import { AnswerDTO, ExtendedEvent, UserActionType } from 'shared/types';
import { getDictionaryText } from 'shared/utils/forms';

import { parseOptions } from './parseOptions';
import { parseResponseValue } from './parseResponseValue';
import { replaceItemVariableWithName } from './replaceItemVariableWithName';
import { convertDateStampToMs } from './convertDateStampToMs';
import { SuccessedEventDTO } from '../../types/answer';

const getTimeByCondition = (time: string) => (condition: boolean) => condition ? time : '';

const SPLASH_SCREEN_ITEM_NAME = 'Splash Screen';

export const getSplashScreen = (event: SuccessedEventDTO, nextExtendedEvent: ExtendedEvent) => {
  const {
    id,
    scheduledDatetime,
    startDatetime,
    endDatetime,
    respondentSecretId,
    respondentId,
    activityId,
    activityName,
    flowId,
    version,
    legacyProfileId,
  } = nextExtendedEvent;
  const getTime = getTimeByCondition(event.time.toString());

  return {
    id,
    activity_scheduled_time: scheduledDatetime ? convertDateStampToMs(scheduledDatetime) : ActivityStatus.NotScheduled,
    activity_start_time: convertDateStampToMs(startDatetime),
    activity_end_time: convertDateStampToMs(endDatetime),
    press_next_time: getTime(event.type === UserActionType.Next),
    press_back_time: getTime(event.type === UserActionType.Prev),
    press_undo_time: getTime(event.type === UserActionType.Undo),
    press_skip_time: getTime(event.type === UserActionType.Skip),
    press_done_time: getTime(event.type === UserActionType.Done),
    response_option_selection_time: getTime(event.type === UserActionType.SetAnswer),
    secret_user_id: respondentSecretId,
    user_id: respondentId,
    activity_id: activityId,
    activity_flow: flowId,
    activity_name: activityName,
    item: SPLASH_SCREEN_ITEM_NAME,
    prompt: '',
    response: '',
    options: '',
    version,
    ...(legacyProfileId && { legacy_user_id: legacyProfileId }),
  };
};

export const getJourneyCSVObject = <T>({
  event,
  rawAnswersObject,
  index,
}: {
  event: ExtendedEvent;
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
    legacyProfileId,
  } = event;
  if (!activityItem) return;

  const responseValues = activityItem?.responseValues as SingleAndMultipleSelectItemResponseValues &
    SliderItemResponseValues;
  const getTime = getTimeByCondition(event.time.toString());

  return {
    id: event.id,
    activity_scheduled_time: scheduledDatetime ? convertDateStampToMs(scheduledDatetime) : ActivityStatus.NotScheduled,
    activity_start_time: convertDateStampToMs(startDatetime),
    activity_end_time: convertDateStampToMs(endDatetime),
    press_next_time: getTime(event.type === UserActionType.Next),
    press_back_time: getTime(event.type === UserActionType.Prev),
    press_undo_time: getTime(event.type === UserActionType.Undo),
    press_skip_time: getTime(event.type === UserActionType.Skip),
    press_done_time: getTime(event.type === UserActionType.Done),
    response_option_selection_time: getTime(event.type === UserActionType.SetAnswer),
    secret_user_id: respondentSecretId,
    user_id: respondentId,
    activity_id: activityId,
    activity_flow: flowName,
    activity_name: activityName,
    item: activityItem.name,
    prompt: replaceItemVariableWithName({
      markdown: getDictionaryText(activityItem.question),
      items: event.items,
      rawAnswersObject,
    }),
    response: parseResponseValue(event, index, true),
    options: replaceItemVariableWithName({
      markdown: parseOptions(responseValues, event.activityItem?.responseType) ?? '',
      items: event.items,
      rawAnswersObject,
    }),
    version,
    ...(legacyProfileId && { legacy_user_id: legacyProfileId }),
  };
};

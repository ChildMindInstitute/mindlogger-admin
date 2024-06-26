import { SingleAndMultipleSelectItemResponseValues, SliderItemResponseValues } from 'shared/state';
import { ActivityStatus } from 'shared/consts';
import { AnswerDTO, ExtendedEvent, JourneyCSVReturnProps, UserActionType } from 'shared/types';
import { getDictionaryText } from 'shared/utils/forms';
import { SuccessedEventDTO } from 'shared/types/answer';

import { parseOptions } from './parseOptions';
import { parseResponseValue } from './parseResponseValue';
import { replaceItemVariableWithName } from './replaceItemVariableWithName';
import { convertDateStampToMs } from './convertDateStampToMs';

const getTimeByCondition = (time: string) => (condition: boolean) => (condition ? time : '');

const SPLASH_SCREEN_ITEM_NAME = 'Splash Screen';

export const getJourneyCSVReturn = ({
  id,
  activity_flow_submission_id,
  activity_scheduled_time,
  activity_start_time,
  activity_end_time,
  press_next_time,
  press_popup_skip_time,
  press_popup_keep_time,
  press_back_time,
  press_undo_time,
  press_skip_time,
  press_done_time,
  response_option_selection_time,
  secret_user_id = '',
  user_id = '',
  activity_id,
  activity_flow_id = '',
  activity_flow_name = '',
  activity_name,
  item,
  item_id = '',
  prompt,
  response,
  options,
  version = '',
  legacy_user_id,
  event_id = '',
  timezone_offset,
}: JourneyCSVReturnProps) => ({
  id,
  activity_flow_submission_id,
  activity_scheduled_time,
  activity_start_time,
  activity_end_time,
  press_next_time,
  press_popup_skip_time,
  press_popup_keep_time,
  press_back_time,
  press_undo_time,
  press_skip_time,
  press_done_time,
  response_option_selection_time,
  secret_user_id,
  user_id,
  activity_id,
  activity_flow_id,
  activity_flow_name,
  activity_name,
  item,
  item_id,
  prompt,
  response,
  options,
  version,
  ...(legacy_user_id && { legacy_user_id }),
  event_id,
  timezone_offset: timezone_offset ?? '',
});

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
    flowName,
    flowId,
    version,
    legacyProfileId,
    submitId,
  } = nextExtendedEvent;
  const getTime = getTimeByCondition(event.time.toString());

  return getJourneyCSVReturn({
    id,
    activity_flow_submission_id: flowId ? submitId : '',
    activity_scheduled_time: scheduledDatetime
      ? convertDateStampToMs(scheduledDatetime)
      : ActivityStatus.NotScheduled,
    activity_start_time: convertDateStampToMs(startDatetime),
    activity_end_time: convertDateStampToMs(endDatetime),
    press_next_time: getTime(event.type === UserActionType.Next),
    press_popup_skip_time: getTime(event.type === UserActionType.SkipPopupConfirm),
    press_popup_keep_time: getTime(event.type === UserActionType.SkipPopupCancel),
    press_back_time: getTime(event.type === UserActionType.Prev),
    press_undo_time: getTime(event.type === UserActionType.Undo),
    press_skip_time: getTime(event.type === UserActionType.Skip),
    press_done_time: getTime(event.type === UserActionType.Done),
    response_option_selection_time: getTime(event.type === UserActionType.SetAnswer),
    secret_user_id: respondentSecretId,
    user_id: respondentId,
    activity_id: activityId,
    activity_flow_id: flowId,
    activity_flow_name: flowName,
    activity_name: activityName,
    item: SPLASH_SCREEN_ITEM_NAME,
    item_id: '',
    prompt: '',
    response: '',
    options: '',
    version,
    ...(legacyProfileId && { legacy_user_id: legacyProfileId }),
    event_id: null,
    timezone_offset: null,
  });
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
    flowId,
    version,
    legacyProfileId,
    scheduledEventId,
    tzOffset,
    submitId,
  } = event;
  if (!activityItem) return;

  const responseValues = activityItem?.responseValues as SingleAndMultipleSelectItemResponseValues &
    SliderItemResponseValues;
  const getTime = getTimeByCondition(event.time.toString());

  return getJourneyCSVReturn({
    id: event.id,
    activity_flow_submission_id: flowId ? submitId : '',
    activity_scheduled_time: scheduledDatetime
      ? convertDateStampToMs(scheduledDatetime)
      : ActivityStatus.NotScheduled,
    activity_start_time: convertDateStampToMs(startDatetime),
    activity_end_time: convertDateStampToMs(endDatetime),
    press_next_time: getTime(event.type === UserActionType.Next),
    press_popup_skip_time: getTime(event.type === UserActionType.SkipPopupConfirm),
    press_popup_keep_time: getTime(event.type === UserActionType.SkipPopupCancel),
    press_back_time: getTime(event.type === UserActionType.Prev),
    press_undo_time: getTime(event.type === UserActionType.Undo),
    press_skip_time: getTime(event.type === UserActionType.Skip),
    press_done_time: getTime(event.type === UserActionType.Done),
    response_option_selection_time: getTime(event.type === UserActionType.SetAnswer),
    secret_user_id: respondentSecretId,
    user_id: respondentId,
    activity_id: activityId,
    activity_flow_id: flowId,
    activity_flow_name: flowName,
    activity_name: activityName,
    item: activityItem.name,
    item_id: activityItem.id,
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
    event_id: scheduledEventId,
    timezone_offset: tzOffset,
  });
};

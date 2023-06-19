import {
  ExtendedEvent,
  UserActionType,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { SingleAndMultipleSelectItemResponseValues, SliderItemResponseValues } from 'shared/state';
import { parseResponseValue, parseOptions } from 'shared/utils/exportData';

export const getJourneyCSVObject = (event: ExtendedEvent) => {
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
  } = event;

  const responseValues = activityItem?.responseValues as SingleAndMultipleSelectItemResponseValues &
    SliderItemResponseValues;

  return {
    id: event.id,
    activity_scheduled_time: scheduledDatetime || 'not scheduled',
    activity_start_time: startDatetime,
    activity_end_time: endDatetime,
    press_next_time: event.type === UserActionType.Next ? event.time.toString() : '',
    press_back_time: event.type === UserActionType.Prev ? event.time.toString() : '',
    press_undo_time: event.type === UserActionType.Undo ? event.time.toString() : '',
    press_skip_time: event.type === UserActionType.Skip ? event.time.toString() : '',
    press_done_time: event.type === UserActionType.Done ? event.time.toString() : '',
    response_option_selection_time:
      event.type === UserActionType.SetAnswer ? event.time.toString() : '',
    secret_user_id: respondentSecretId,
    user_id: respondentId,
    activity_id: activityId,
    activity_flow: flowId,
    activity_name: activityName,
    item: activityItem.name,
    prompt: activityItem.question?.en,
    response: parseResponseValue(answer, event.activityItem?.responseType),
    options: parseOptions(responseValues, event.activityItem?.responseType),
    version,
  };
};

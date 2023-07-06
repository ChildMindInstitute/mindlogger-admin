import {
  AnswerDTO,
  ExtendedEvent,
  UserActionType,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { SingleAndMultipleSelectItemResponseValues, SliderItemResponseValues } from 'shared/state';
import {
  parseResponseValue,
  parseOptions,
  replaceItemVariableWithName,
} from 'shared/utils/exportData';
import { ActivityStatus } from 'shared/consts';
import { ExtendedExportAnswerWithoutEncryption } from 'shared/types';

const getTimeByCondition = (time: string) => (condition: boolean) => condition ? time : '';

export const getJourneyCSVObject = <T>({
  event,
  rawAnswersObject,
}: {
  event: ExtendedEvent<ExtendedExportAnswerWithoutEncryption>;
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
  } = event;

  const responseValues = activityItem?.responseValues as SingleAndMultipleSelectItemResponseValues &
    SliderItemResponseValues;
  const getTime = getTimeByCondition(event.time.toString());

  return {
    id: event.id,
    activity_scheduled_time: scheduledDatetime || ActivityStatus.NotScheduled,
    activity_start_time: startDatetime,
    activity_end_time: endDatetime,
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
    item: activityItem.name,
    prompt: replaceItemVariableWithName({
      markdown: activityItem.question?.en ?? '',
      items: event.items,
      rawAnswersObject,
    }),
    response: parseResponseValue(answer, event.activityItem?.responseType),
    options: replaceItemVariableWithName({
      markdown: parseOptions(responseValues, event.activityItem?.responseType) ?? '',
      items: event.items,
      rawAnswersObject,
    }),
    version,
  };
};

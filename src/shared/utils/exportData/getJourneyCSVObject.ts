// eslint-disable no-console
import { ActivityStatus } from 'shared/consts';
import { SingleAndMultipleSelectItemResponseValues, SliderItemResponseValues } from 'shared/state';
import { AnswerDTO, ExtendedEvent, JourneyCSVReturnProps, UserActionType } from 'shared/types';
import { SuccessedEventDTO } from 'shared/types/answer';
import { getDictionaryText } from 'shared/utils/forms';

import { checkIfShouldLogging } from '../logger';
import { convertDateStampToMs } from './convertDateStampToMs';
import { parseOptions } from './parseOptions';
import { parseResponseValue } from './parseResponseValue';
import { replaceItemVariableWithName } from './replaceItemVariableWithName';

const getTimeByCondition = (time: string) => (condition: boolean) => (condition ? time : '');

const SPLASH_SCREEN_ITEM_NAME = 'Splash Screen';

export const getJourneyCSVReturn = (
  returnProps: JourneyCSVReturnProps,
  enableDataExportRenaming?: boolean,
) => {
  const shouldLogDataInDebugMode = checkIfShouldLogging();

  if (shouldLogDataInDebugMode) {
    console.log(
      `[getJourneyCSVReturn] Processing journey CSV return for item: ${returnProps.item}, type: ${returnProps.item_type}`,
    );
  }

  const {
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
    source_user_subject_id = '',
    source_user_secret_id = '',
    source_user_nickname = '',
    source_user_relation = '',
    source_user_tag = '',
    target_user_subject_id = '',
    target_user_secret_id = '',
    target_user_nickname = '',
    target_user_tag = '',
    input_user_subject_id = '',
    input_user_secret_id = '',
    input_user_nickname = '',
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
    item_type,
    legacy_user_id = null,
    event_id = '',
    timezone_offset = null,
  } = returnProps;

  return enableDataExportRenaming
    ? {
        target_id: target_user_subject_id,
        target_secret_id: target_user_secret_id,
        target_nickname: target_user_nickname,
        target_tag: target_user_tag,
        source_id: source_user_subject_id,
        source_secret_id: source_user_secret_id,
        source_nickname: source_user_nickname,
        source_tag: source_user_tag,
        source_relation: source_user_relation,
        input_id: input_user_subject_id,
        input_secret_id: input_user_secret_id,
        input_nickname: input_user_nickname,
        user_id,
        secret_user_id,
        legacy_user_id,
        applet_version: version,
        activity_flow_id,
        activity_flow_name,
        activity_flow_submission_id,
        activity_id,
        activity_name,
        activity_submission_id: id,
        activity_start_time,
        activity_end_time,
        activity_schedule_id: event_id,
        activity_schedule_start_time: activity_scheduled_time,
        utc_timezone_offset: timezone_offset,
        item_id,
        item_name: item,
        item_prompt: prompt,
        item_response_options: options,
        item_response: response,
        item_type,
        press_next_time,
        press_popup_skip_time,
        press_popup_keep_time,
        press_back_time,
        press_undo_time,
        press_skip_time,
        press_done_time,
        response_option_selection_time,
      }
    : {
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
        source_user_subject_id,
        source_user_secret_id,
        source_user_nickname,
        source_user_relation,
        source_user_tag,
        target_user_subject_id,
        target_user_secret_id,
        target_user_nickname,
        target_user_tag,
        input_user_subject_id,
        input_user_secret_id,
        input_user_nickname,
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
        item_type,
        event_id,
        timezone_offset,
        legacy_user_id,
      };
};

export const getSplashScreen = (event: SuccessedEventDTO, nextExtendedEvent: ExtendedEvent) => {
  const shouldLogDataInDebugMode = checkIfShouldLogging();

  if (shouldLogDataInDebugMode) {
    console.log(
      `[getSplashScreen] Creating splash screen for event at time ${event.time} with next event screen ${nextExtendedEvent.screen}`,
    );
  }

  try {
    const {
      activityItem,
      id,
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
      flowName,
      flowId,
      version,
      legacyProfileId,
      submitId,
    } = nextExtendedEvent;

    const getTime = getTimeByCondition(event.time.toString());

    if (!activityItem) {
      if (shouldLogDataInDebugMode) {
        console.warn(`[getSplashScreen] No activityItem found in next event, returning undefined`);
      }

      return undefined;
    }

    if (shouldLogDataInDebugMode) {
      console.log(
        `[getSplashScreen] Creating splash screen with activity: ${activityName}, item: ${SPLASH_SCREEN_ITEM_NAME}`,
      );
    }

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
      source_user_subject_id: sourceSubjectId,
      source_user_secret_id: sourceSecretId,
      source_user_nickname: sourceUserNickname,
      source_user_relation: relation,
      source_user_tag: sourceUserTag,
      target_user_subject_id: targetSubjectId,
      target_user_secret_id: targetSecretId,
      target_user_nickname: targetUserNickname,
      target_user_tag: targetUserTag,
      input_user_subject_id: inputSubjectId,
      input_user_secret_id: inputSecretId,
      input_user_nickname: inputUserNickname,
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
      item_type: activityItem.responseType,
      event_id: null,
      timezone_offset: null,
      legacy_user_id: legacyProfileId,
    });
  } catch (error) {
    console.error(`[getSplashScreen] Error creating splash screen:`, error);
    if (error instanceof Error && shouldLogDataInDebugMode) {
      console.error(
        `[getSplashScreen] Error details: ${error.name}: ${error.message}, Stack: ${error.stack}`,
      );
    }

    return undefined;
  }
};

export const getJourneyCSVObject = <T>({
  event,
  rawAnswersObject,
  index,
  enableDataExportRenaming,
}: {
  event: ExtendedEvent;
  rawAnswersObject: Record<string, T & { answer: AnswerDTO }>;
  index: number;
  enableDataExportRenaming: boolean;
}) => {
  const shouldLogDataInDebugMode = checkIfShouldLogging();

  if (shouldLogDataInDebugMode) {
    console.log(
      `[getJourneyCSVObject] Processing event with screen: ${event.screen}, type: ${event.type}, index: ${index}`,
    );
  }

  try {
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
      flowName,
      flowId,
      version,
      legacyProfileId,
      scheduledEventId,
      tzOffset,
      submitId,
    } = event;

    if (!activityItem) {
      if (shouldLogDataInDebugMode) {
        console.warn(
          `[getJourneyCSVObject] No activityItem found for event with screen: ${event.screen}, returning undefined`,
        );
      }

      return undefined;
    }

    const responseValues =
      activityItem?.responseValues as SingleAndMultipleSelectItemResponseValues &
        SliderItemResponseValues;
    const getTime = getTimeByCondition(event.time.toString());

    if (shouldLogDataInDebugMode) {
      console.log(
        `[getJourneyCSVObject] Creating journey CSV object for activity: ${activityName}, item: ${activityItem.name}`,
      );
    }

    let response, options;
    try {
      response = parseResponseValue(event, index, true);
      options = replaceItemVariableWithName({
        markdown: parseOptions(responseValues, event.activityItem?.responseType) ?? '',
        items: event.items,
        rawAnswersObject,
      });

      if (shouldLogDataInDebugMode) {
        console.log(
          `[getJourneyCSVObject] Parsed response value length: ${
            response ? response.length : 0
          }, options length: ${options ? options.length : 0}`,
        );
      }
    } catch (parseError) {
      console.error(`[getJourneyCSVObject] Error parsing response or options:`, parseError);
      if (parseError instanceof Error && shouldLogDataInDebugMode) {
        console.error(
          `[getJourneyCSVObject] Parse error details: ${parseError.name}: ${parseError.message}, Stack: ${parseError.stack}`,
        );
      }
      response = '';
      options = '';
    }

    return getJourneyCSVReturn(
      {
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
        source_user_subject_id: sourceSubjectId,
        source_user_secret_id: sourceSecretId,
        source_user_nickname: sourceUserNickname,
        source_user_relation: relation,
        source_user_tag: sourceUserTag,
        target_user_subject_id: targetSubjectId,
        target_user_secret_id: targetSecretId,
        target_user_nickname: targetUserNickname,
        target_user_tag: targetUserTag,
        input_user_subject_id: inputSubjectId,
        input_user_secret_id: inputSecretId,
        input_user_nickname: inputUserNickname,
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
        response,
        options,
        version,
        item_type: activityItem.responseType,
        event_id: scheduledEventId,
        timezone_offset: tzOffset,
        legacy_user_id: legacyProfileId,
      },
      enableDataExportRenaming,
    );
  } catch (error) {
    console.error(`[getJourneyCSVObject] Error creating journey CSV object:`, error);
    if (error instanceof Error && shouldLogDataInDebugMode) {
      console.error(
        `[getJourneyCSVObject] Error details: ${error.name}: ${error.message}, Stack: ${error.stack}`,
      );
      console.error(
        `[getJourneyCSVObject] Event data: screen=${event.screen}, type=${
          event.type
        }, activityName=${event.activityName || 'N/A'}`,
      );
    }

    return undefined;
  }
};

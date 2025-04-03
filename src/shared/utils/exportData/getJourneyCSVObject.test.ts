import { ItemFormValues } from 'modules/Builder/types';
import { ExtendedEvent, UserActionType } from 'shared/types';

import { getObjectFromList } from '../getObjectFromList';
import { getJourneyCSVObject } from './getJourneyCSVObject';

const singleSelectionItem = {
  question: 'single [[text_last]]',
  responseType: 'singleSelect',
  responseValues: {
    paletteName: null,
    options: [
      {
        id: 'b9a71359-467a-4bb8-84a5-6a8fe61da246',
        text: 'opt1',
        image: null,
        score: 4,
        tooltip: null,
        isHidden: false,
        color: null,
        alert: null,
        value: 1,
      },
      {
        id: '000394a5-2963-4f12-8b5f-e9340051512a',
        text: 'opt2',
        image: null,
        score: 2,
        tooltip: null,
        isHidden: false,
        color: null,
        alert: null,
        value: 2,
      },
    ],
  },
  config: {
    removeBackButton: false,
    skippableItem: false,
    randomizeOptions: false,
    timer: 0,
    addScores: true,
    setAlerts: false,
    addTooltip: false,
    setPalette: false,
    addTokens: null,
    additionalResponseOption: {
      textInputOption: true,
      textInputRequired: false,
    },
    autoAdvance: false,
  },
  name: 'single_text_score',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: 'ea07cf9f-4fd3-42e7-b4a1-f88fb00ef629',
};

const items = [singleSelectionItem];
const decryptedSingleSelection = {
  activityItem: singleSelectionItem,
  items,
  type: UserActionType.SetAnswer,
  screen: '62e7e2c2-9fdb-4f2f-8460-78375a657f57/ea07cf9f-4fd3-42e7-b4a1-f88fb00ef629',
  time: 1689755869391,
  response: {
    value: 2,
    text: 'Extra info',
  },
  answer: {
    value: 2,
    text: 'Extra info',
  },
  id: '949f248c-1a4b-4a35-a5a2-898dfef72050',
  submitId: 'becbb3e7-3e29-4b27-a224-85ee4db54c86',
  version: '2.0.0',
  respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
  sourceSubjectId: 'bba7bcd3-f245-4354-9461-b494f186dcca',
  sourceSecretId: 'source-secret-id',
  sourceUserNickname: 'Mock source user',
  sourceUserTag: 'Mock Tag',
  targetSubjectId: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
  targetSecretId: 'target-secret-id',
  targetUserNickname: 'Mock target user',
  targetUserTag: 'Mock Tag',
  inputSubjectId: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
  inputSecretId: 'input-secret-id',
  inputUserNickname: 'Mock input user',
  relation: 'admin',
  respondentSecretId: 'secretUserId',
  legacyProfileId: null,
  scheduledDatetime: null,
  startDatetime: 1689755822,
  endDatetime: 1689756087,
  migratedDate: null,
  appletHistoryId: '7aa07032-93f5-41aa-a4e1-b24d92405bc0_2.0.0',
  activityHistoryId: '62e7e2c2-9fdb-4f2f-8460-78375a657f57_2.0.0',
  flowHistoryId: null,
  flowName: null,
  reviewedAnswerId: null,
  createdAt: '2023-07-19T08:41:37.130943',
  client: null,
  appletId: '7aa07032-93f5-41aa-a4e1-b24d92405bc0',
  activityId: '62e7e2c2-9fdb-4f2f-8460-78375a657f57',
  flowId: null,
  activityName: 'New Activity#1',
  subscaleSetting: null,
  scheduledEventId: null,
  tzOffset: null,
};
const getPreparedProperties = ({
  activityItem,
  decryptedData,
}: {
  activityItem: ItemFormValues;
  decryptedData: ExtendedEvent;
}) => {
  const items = [activityItem];
  //eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const event = {
    ...decryptedData,
    activityItem,
    items,
  } as ExtendedEvent;

  return {
    event,
    rawAnswersObject: getObjectFromList([event], (event) => event.activityItem.name),
  };
};
const legacyResult = {
  activity_end_time: '1689756087000',
  activity_id: '62e7e2c2-9fdb-4f2f-8460-78375a657f57',
  activity_name: 'New Activity#1',
  activity_flow_id: null,
  activity_flow_name: null,
  activity_scheduled_time: 'not scheduled',
  activity_start_time: '1689755822000',
  id: '949f248c-1a4b-4a35-a5a2-898dfef72050',
  activity_flow_submission_id: '',
  item: 'single_text_score',
  item_id: 'ea07cf9f-4fd3-42e7-b4a1-f88fb00ef629',
  options: 'Opt1: 1 (score: 4), Opt2: 2 (score: 2)',
  prompt: 'single  ',
  item_type: 'singleSelect',
  press_back_time: '',
  press_popup_skip_time: '',
  press_popup_keep_time: '',
  press_done_time: '',
  press_next_time: '',
  press_skip_time: '',
  press_undo_time: '',
  response: 'value: 2 | text: Extra info',
  response_option_selection_time: '1689755869391',
  secret_user_id: 'secretUserId',
  user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
  source_user_subject_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
  source_user_secret_id: 'source-secret-id',
  source_user_nickname: 'Mock source user',
  source_user_tag: 'Mock Tag',
  source_user_relation: 'admin',
  target_user_subject_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
  target_user_secret_id: 'target-secret-id',
  target_user_nickname: 'Mock target user',
  target_user_tag: 'Mock Tag',
  input_user_subject_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
  input_user_secret_id: 'input-secret-id',
  input_user_nickname: 'Mock input user',
  version: '2.0.0',
  event_id: null,
  timezone_offset: null,
  legacy_user_id: null,
};

const result = {
  target_id: '116d59c1-2bb5-405b-8503-cb6c1e6b7620',
  target_secret_id: 'target-secret-id',
  target_nickname: 'Mock target user',
  target_tag: 'Mock Tag',
  source_id: 'bba7bcd3-f245-4354-9461-b494f186dcca',
  source_secret_id: 'source-secret-id',
  source_nickname: 'Mock source user',
  source_tag: 'Mock Tag',
  source_relation: 'admin',
  input_id: '0a7544d8-bae2-4ed9-9e83-80401e537cd9',
  input_secret_id: 'input-secret-id',
  input_nickname: 'Mock input user',
  user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
  secret_user_id: 'secretUserId',
  legacy_user_id: null,
  applet_version: '2.0.0',
  activity_flow_id: null,
  activity_flow_name: null,
  activity_flow_submission_id: '',
  activity_id: '62e7e2c2-9fdb-4f2f-8460-78375a657f57',
  activity_name: 'New Activity#1',
  activity_submission_id: '949f248c-1a4b-4a35-a5a2-898dfef72050',
  activity_start_time: '1689755822000',
  activity_end_time: '1689756087000',
  activity_schedule_id: null,
  activity_schedule_start_time: 'not scheduled',
  utc_timezone_offset: null,
  item_id: 'ea07cf9f-4fd3-42e7-b4a1-f88fb00ef629',
  item_name: 'single_text_score',
  item_prompt: 'single  ',
  item_response_options: 'Opt1: 1 (score: 4), Opt2: 2 (score: 2)',
  item_response: 'value: 2 | text: Extra info',
  item_type: 'singleSelect',
  press_next_time: '',
  press_popup_skip_time: '',
  press_popup_keep_time: '',
  press_back_time: '',
  press_undo_time: '',
  press_skip_time: '',
  press_done_time: '',
  response_option_selection_time: '1689755869391',
};

describe('getJourneyCSVObject', () => {
  test('returns correct result with legacy naming', () => {
    expect(
      getJourneyCSVObject({
        ...getPreparedProperties({
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          activityItem: singleSelectionItem,
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          decryptedData: decryptedSingleSelection,
        }),
        index: 0,
        enableDataExportRenaming: false,
      }),
    ).toStrictEqual(legacyResult);
  });

  test('returns correct result with new naming', () => {
    expect(
      getJourneyCSVObject({
        ...getPreparedProperties({
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          activityItem: singleSelectionItem,
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          decryptedData: decryptedSingleSelection,
        }),
        index: 0,
        enableDataExportRenaming: true,
      }),
    ).toStrictEqual(result);
  });

  test('returns object with scheduled time', () => {
    expect(
      getJourneyCSVObject({
        ...getPreparedProperties({
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          activityItem: singleSelectionItem,
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          decryptedData: {
            ...decryptedSingleSelection,
            scheduledDatetime: decryptedSingleSelection.startDatetime,
          },
        }),
        index: 0,
        enableDataExportRenaming: false,
      }),
    ).toStrictEqual({
      ...legacyResult,
      activity_scheduled_time: '1689755822000',
    });
  });

  test('returns object with legacyProfileId', () => {
    expect(
      getJourneyCSVObject({
        ...getPreparedProperties({
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          activityItem: singleSelectionItem,
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          decryptedData: {
            ...decryptedSingleSelection,
            legacyProfileId: 'legacy-profile-id',
          },
        }),
        index: 0,
        enableDataExportRenaming: false,
      }),
    ).toStrictEqual({
      ...legacyResult,
      legacy_user_id: 'legacy-profile-id',
    });
  });

  test('returns object with event_id', () => {
    expect(
      getJourneyCSVObject({
        ...getPreparedProperties({
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          activityItem: singleSelectionItem,
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          decryptedData: {
            ...decryptedSingleSelection,
            scheduledEventId: 'scheduled-event-id',
          },
        }),
        index: 0,
        enableDataExportRenaming: false,
      }),
    ).toStrictEqual({
      ...legacyResult,
      event_id: 'scheduled-event-id',
    });
  });

  test('returns object with timezone_offset', () => {
    expect(
      getJourneyCSVObject({
        ...getPreparedProperties({
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          activityItem: singleSelectionItem,
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          decryptedData: {
            ...decryptedSingleSelection,
            tzOffset: -300,
          },
        }),
        index: 0,
        enableDataExportRenaming: false,
      }),
    ).toStrictEqual({
      ...legacyResult,
      timezone_offset: -300,
    });
  });

  test('returns object with activity name, activity flow id, and activity flow submission id', () => {
    expect(
      getJourneyCSVObject({
        ...getPreparedProperties({
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          activityItem: singleSelectionItem,
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          decryptedData: {
            ...decryptedSingleSelection,
            flowName: 'test flow name',
            flowId: 'some flow ID 222',
          },
        }),
        index: 0,
        enableDataExportRenaming: false,
      }),
    ).toStrictEqual({
      ...legacyResult,
      activity_flow_submission_id: 'becbb3e7-3e29-4b27-a224-85ee4db54c86',
      activity_flow_id: 'some flow ID 222',
      activity_flow_name: 'test flow name',
    });
  });

  test.each`
    userActionType                     | expectedResult
    ${UserActionType.Next}             | ${{ press_next_time: '1689755869391' }}
    ${UserActionType.SkipPopupConfirm} | ${{ press_popup_skip_time: '1689755869391' }}
    ${UserActionType.SkipPopupCancel}  | ${{ press_popup_keep_time: '1689755869391' }}
    ${UserActionType.Prev}             | ${{ press_back_time: '1689755869391' }}
    ${UserActionType.Undo}             | ${{ press_undo_time: '1689755869391' }}
    ${UserActionType.Skip}             | ${{ press_skip_time: '1689755869391' }}
    ${UserActionType.Done}             | ${{ press_done_time: '1689755869391' }}
  `('return object with action type=$userActionType', ({ userActionType, expectedResult }) => {
    expect(
      getJourneyCSVObject({
        ...getPreparedProperties({
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          activityItem: singleSelectionItem,
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          decryptedData: {
            ...decryptedSingleSelection,
            type: userActionType,
            response: undefined,
            answer: null,
          },
        }),
        index: 0,
        enableDataExportRenaming: false,
      }),
    ).toStrictEqual({
      ...legacyResult,
      ...expectedResult,
      response: '',
      response_option_selection_time: '',
    });
  });
});

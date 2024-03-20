import { ItemFormValues } from 'modules/Builder/types';
import { ExtendedEvent } from 'shared/types';

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
  type: 'SET_ANSWER',
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
const result = {
  activity_end_time: '1689756087000',
  activity_flow: null,
  activity_id: '62e7e2c2-9fdb-4f2f-8460-78375a657f57',
  activity_name: 'New Activity#1',
  activity_scheduled_time: 'not scheduled',
  activity_start_time: '1689755822000',
  id: '949f248c-1a4b-4a35-a5a2-898dfef72050',
  item: 'single_text_score',
  item_id: 'ea07cf9f-4fd3-42e7-b4a1-f88fb00ef629',
  options: 'Opt1: 1 (score: 4), Opt2: 2 (score: 2)',
  prompt: 'single  ',
  press_back_time: '',
  press_done_time: '',
  press_next_time: '',
  press_skip_time: '',
  press_undo_time: '',
  response: 'value: 2 | text: Extra info',
  response_option_selection_time: '1689755869391',
  secret_user_id: 'secretUserId',
  user_id: '835e5277-5949-4dff-817a-d85c17a3604f',
  version: '2.0.0',
  event_id: null,
  timezone_offset: null,
};

describe('getJourneyCSVObject', () => {
  test('returns correct result', () => {
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
      }),
    ).toStrictEqual({
      ...result,
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
      }),
    ).toStrictEqual({
      ...result,
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
      }),
    ).toStrictEqual({
      ...result,
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
      }),
    ).toStrictEqual({
      ...result,
      timezone_offset: -300,
    });
  });
});

import { ActivityStatus } from 'shared/consts';
import { mockedExportContextItemData, mockedSingleActivityItem } from 'shared/mock';

import { getFlag } from './getFlag';

const singleItem = {
  activityItem: mockedSingleActivityItem,
  answer: {
    value: 2,
    text: 'Extra info',
  },
  items: [],
  ...mockedExportContextItemData,
};
const missedSingleItem = {
  ...singleItem,
  scheduledDatetime: 1689755822,
  startDatetime: null,
};
const abTrialsCompletedItem = {
  activityItem: {
    question: '',
    responseType: 'ABTrails',
    responseValues: null,
    config: {
      deviceType: 'mobile',
      orderName: 'first',
      tutorials: {
        tutorials: [], // skipped for the test case
      },
      nodes: {
        radius: 4.18,
        fontSize: 5.6,
        fontSizeBeginEnd: null,
        beginWordLength: null,
        endWordLength: null,
        nodes: [], // skipped for the test case
      },
    },
    name: 'ABTrails_mobile_1',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: false,
    id: 'ef510597-821a-444b-bf99-ae4d3c847866',
  },
  answer: {
    value: {
      maximumIndex: 11,
      currentIndex: 11,
      startTime: 1689928556724,
      width: 362.7272644042969,
      updated: true,
      lines: [], // skipped for the test case
    },
  },
  id: '72b3985c-4352-4a9d-9c23-2455cc607781',
  submitId: '7b10bb4e-19a4-437c-a284-adcd6f5559ed',
  version: '1.1.0',
  respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
  respondentSecretId: 'testt@mail.com',
  legacyProfileId: null,
  scheduledDatetime: null,
  startDatetime: 1689928536,
  endDatetime: 1689928679,
  migratedDate: null,
  tzOffset: null,
  scheduledEventId: null,
  appletHistoryId: '3c32e00a-70c8-4f97-b549-5b536e9f8719_1.1.0',
  activityHistoryId: '160adf2b-0a69-46fd-8326-fb53ed77eb27_1.1.0',
  flowHistoryId: null,
  flowName: null,
  reviewedAnswerId: null,
  createdAt: '2023-07-21T08:38:08.324411',
  client: null,
  appletId: '3c32e00a-70c8-4f97-b549-5b536e9f8719',
  activityId: '160adf2b-0a69-46fd-8326-fb53ed77eb27',
  flowId: null,
  items: [], // skipped for the test case
  activityName: 'A/B Trails Mobile',
  subscaleSetting: null,
};
const abTrialsSkippedItem = {
  ...abTrialsCompletedItem,
  answer: null,
};
const abTrialsIncompletedItem = {
  ...abTrialsCompletedItem,
  answer: {
    ...abTrialsCompletedItem.answer,
    value: {
      ...abTrialsCompletedItem.answer.value,
      currentIndex: 4,
    },
  },
};
describe('getFlag', () => {
  test.each`
    item                       | expected                     | description
    ${singleItem}              | ${ActivityStatus.Completed}  | ${'should return comleted'}
    ${missedSingleItem}        | ${ActivityStatus.Missed}     | ${'should return missed'}
    ${abTrialsCompletedItem}   | ${ActivityStatus.Completed}  | ${'should return completed when abtrails and a round was passed'}
    ${abTrialsSkippedItem}     | ${ActivityStatus.Incomplete} | ${'should return incomplete when abtrails and a round was skipped at once'}
    ${abTrialsIncompletedItem} | ${ActivityStatus.Incomplete} | ${'should return incomplete when abtrails and a round was not completed after start'}
  `('$description', ({ item, expected }) => {
    expect(getFlag(item)).toBe(expected);
  });
});

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
describe('getFlag', () => {
  test.each`
    item                | expected                    | description
    ${singleItem}       | ${ActivityStatus.Completed} | ${'should return flag comleted'}
    ${missedSingleItem} | ${ActivityStatus.Missed}    | ${'should return flag missed'}
  `('$description', ({ item, expected }) => {
    expect(getFlag(item)).toBe(expected);
  });
});

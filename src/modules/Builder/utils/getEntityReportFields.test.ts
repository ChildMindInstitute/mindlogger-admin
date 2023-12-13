import {
  getEntityReportFields,
  FlowReportFieldsPrepareType as Type,
} from './getEntityReportFields';

const activities = [
  {
    name: 'Activity-1',
    id: 'activity-id-1',
    key: 'activity-key-1',
    items: [{ name: 'Item-1', id: 'id-1', key: 'item-key-1' }],
  },
  {
    name: 'Activity-2',
    id: 'activity-id-2',
    key: 'activity-key-2',
    items: [{ name: 'Item-2', id: 'id-2', key: 'item-key-2' }],
  },
];

const activityItems = [
  { name: 'Item-1', id: 'id-1', key: 'item-key-1' },
  { name: 'Item-2', id: 'id-2', key: 'item-key-2' },
];

const description1 =
  'returns empty reportIncludedActivityName for KeyToName type when reportActivity and activities are not provided';
const description2 =
  'returns empty reportIncludedActivityName for NameToKey type when reportActivity and activities are not provided';
const description3 =
  'returns empty reportIncludedItemName when reportItem is not provided and activityItems are provided';
const description4 =
  'returns empty reportIncludedActivityName when reportActivity is not provided and type is NameToKey';
const description5 =
  'returns correct reportIncludedActivityName when reportActivity is provided and type is KeyToName';
const description6 =
  'returns correct reportIncludedActivityName when reportActivity is provided and type is NameToKey';
const description7 =
  'returns correct reportIncludedActivityName when reportActivity is provided as key and type is NameToKey';
const description8 = 'returns empty reportIncludedItemName when reportItem is provided as key';
const description9 =
  'returns correct reportIncludedItemName when reportItem is provided as key and type is NameToKey';
const description10 =
  'returns correct reportIncludedItemName when reportItem is provided and activityItems are provided';
const description11 =
  'returns correct reportIncludedItemName when reportItem is provided as key and type is NameToKey';

describe('getEntityReportFields', () => {
  test.each`
    reportActivity     | reportItem   | type              | activities    | activityItems    | expected                                                                       | description
    ${undefined}       | ${undefined} | ${Type.KeyToName} | ${undefined}  | ${undefined}     | ${{ reportIncludedItemName: '', reportIncludedActivityName: '' }}              | ${description1}
    ${undefined}       | ${undefined} | ${Type.NameToKey} | ${undefined}  | ${undefined}     | ${{ reportIncludedItemName: '', reportIncludedActivityName: '' }}              | ${description2}
    ${undefined}       | ${undefined} | ${Type.KeyToName} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: '' }}                                              | ${description3}
    ${undefined}       | ${undefined} | ${Type.NameToKey} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: '' }}                                              | ${description4}
    ${'activity-id-1'} | ${undefined} | ${Type.KeyToName} | ${activities} | ${undefined}     | ${{ reportIncludedItemName: '', reportIncludedActivityName: 'Activity-1' }}    | ${description5}
    ${'Activity-1'}    | ${undefined} | ${Type.NameToKey} | ${activities} | ${undefined}     | ${{ reportIncludedItemName: '', reportIncludedActivityName: 'activity-id-1' }} | ${description6}
    ${'activity-id-1'} | ${undefined} | ${Type.NameToKey} | ${activities} | ${undefined}     | ${{ reportIncludedItemName: '', reportIncludedActivityName: '' }}              | ${description7}
    ${'activity-id-2'} | ${undefined} | ${Type.KeyToName} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: '' }}                                              | ${description8}
    ${'Activity-2'}    | ${undefined} | ${Type.NameToKey} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: '' }}                                              | ${description9}
    ${undefined}       | ${'id-1'}    | ${Type.KeyToName} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: 'Item-1' }}                                        | ${description10}
    ${undefined}       | ${'Item-1'}  | ${Type.NameToKey} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: 'id-1' }}                                          | ${description11}
  `('$description', ({ reportActivity, reportItem, type, activities, activityItems, expected }) => {
    const result = getEntityReportFields({
      reportActivity,
      reportItem,
      type,
      activities,
      activityItems,
    });

    expect(result.reportIncludedItemName).toBe(expected.reportIncludedItemName);

    if (!activityItems) {
      expect(result.reportIncludedActivityName).toBe(expected.reportIncludedActivityName);
    }
  });
});

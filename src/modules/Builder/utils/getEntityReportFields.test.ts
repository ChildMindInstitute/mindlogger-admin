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

const emptyDescription = 'returns empty expected fields';
const activityNameDescription = 'returns reportIncludedActivityName';
const itemNameDescription = 'returns reportIncludedItemName';

describe('getEntityReportFields', () => {
  test.each`
    reportActivity     | reportItem   | type              | activities    | activityItems    | expected                                                                       | description
    ${undefined}       | ${undefined} | ${Type.KeyToName} | ${undefined}  | ${undefined}     | ${{ reportIncludedItemName: '', reportIncludedActivityName: '' }}              | ${emptyDescription}
    ${undefined}       | ${undefined} | ${Type.NameToKey} | ${undefined}  | ${undefined}     | ${{ reportIncludedItemName: '', reportIncludedActivityName: '' }}              | ${emptyDescription}
    ${undefined}       | ${undefined} | ${Type.KeyToName} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: '' }}                                              | ${emptyDescription}
    ${undefined}       | ${undefined} | ${Type.NameToKey} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: '' }}                                              | ${emptyDescription}
    ${'activity-id-1'} | ${undefined} | ${Type.KeyToName} | ${activities} | ${undefined}     | ${{ reportIncludedItemName: '', reportIncludedActivityName: 'Activity-1' }}    | ${activityNameDescription}
    ${'Activity-1'}    | ${undefined} | ${Type.NameToKey} | ${activities} | ${undefined}     | ${{ reportIncludedItemName: '', reportIncludedActivityName: 'activity-id-1' }} | ${activityNameDescription}
    ${'activity-id-1'} | ${undefined} | ${Type.NameToKey} | ${activities} | ${undefined}     | ${{ reportIncludedItemName: '', reportIncludedActivityName: '' }}              | ${emptyDescription}
    ${'activity-id-2'} | ${undefined} | ${Type.KeyToName} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: '' }}                                              | ${emptyDescription}
    ${'Activity-2'}    | ${undefined} | ${Type.NameToKey} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: '' }}                                              | ${emptyDescription}
    ${undefined}       | ${'id-1'}    | ${Type.KeyToName} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: 'Item-1' }}                                        | ${itemNameDescription}
    ${undefined}       | ${'Item-1'}  | ${Type.NameToKey} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: 'id-1' }}                                          | ${itemNameDescription}
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

  test('should return empty reportIncludedActivityName and reportIncludedItemName for NameToKey type and reviewable activity', () => {
    const nonReviewableKeys = ['activity-key-1'];

    const result = getEntityReportFields({
      reportActivity: 'Activity-2',
      reportItem: 'Item-2',
      activities,
      type: Type.NameToKey,
      nonReviewableKeys,
    });

    expect(result).toEqual({
      reportIncludedActivityName: '',
      reportIncludedItemName: '',
    });
  });
});

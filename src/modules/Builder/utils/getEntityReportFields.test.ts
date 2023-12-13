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

describe('getEntityReportFields', () => {
  test.each`
    reportActivity     | reportItem   | type              | activities    | activityItems    | expected                                                                       | description
    ${undefined}       | ${undefined} | ${Type.KeyToName} | ${undefined}  | ${undefined}     | ${{ reportIncludedItemName: '', reportIncludedActivityName: '' }}              | ${'returns empty reportIncludedActivityName for KeyToName type when reportActivity and activities are not provided'}
    ${undefined}       | ${undefined} | ${Type.NameToKey} | ${undefined}  | ${undefined}     | ${{ reportIncludedItemName: '', reportIncludedActivityName: '' }}              | ${'returns empty reportIncludedActivityName for NameToKey type when reportActivity and activities are not provided'}
    ${undefined}       | ${undefined} | ${Type.KeyToName} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: '' }}                                              | ${'returns empty reportIncludedItemName when reportItem is not provided and activityItems are provided'}
    ${undefined}       | ${undefined} | ${Type.NameToKey} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: '' }}                                              | ${'returns empty reportIncludedActivityName when reportActivity is not provided and type is NameToKey'}
    ${'activity-id-1'} | ${undefined} | ${Type.KeyToName} | ${activities} | ${undefined}     | ${{ reportIncludedItemName: '', reportIncludedActivityName: 'Activity-1' }}    | ${'returns correct reportIncludedActivityName when reportActivity is provided and type is KeyToName'}
    ${'Activity-1'}    | ${undefined} | ${Type.NameToKey} | ${activities} | ${undefined}     | ${{ reportIncludedItemName: '', reportIncludedActivityName: 'activity-id-1' }} | ${'returns correct reportIncludedActivityName when reportActivity is provided and type is NameToKey'}
    ${'activity-id-1'} | ${undefined} | ${Type.NameToKey} | ${activities} | ${undefined}     | ${{ reportIncludedItemName: '', reportIncludedActivityName: '' }}              | ${'returns correct reportIncludedActivityName when reportActivity is provided as key and type is NameToKey'}
    ${'activity-id-2'} | ${undefined} | ${Type.KeyToName} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: '' }}                                              | ${'returns empty reportIncludedItemName when reportItem is provided as key'}
    ${'Activity-2'}    | ${undefined} | ${Type.NameToKey} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: '' }}                                              | ${'returns correct reportIncludedItemName when reportItem is provided as key and type is NameToKey'}
    ${undefined}       | ${'id-1'}    | ${Type.KeyToName} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: 'Item-1' }}                                        | ${'returns correct reportIncludedItemName when reportItem is provided and activityItems are provided'}
    ${undefined}       | ${'Item-1'}  | ${Type.NameToKey} | ${activities} | ${activityItems} | ${{ reportIncludedItemName: 'id-1' }}                                          | ${'returns correct reportIncludedItemName when reportItem is provided as key and type is NameToKey'}
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

import { getFilteredSelectedItems, getUpdatedSelectedItems } from './getCheckedItems'; // Adjust the path to where the functions are actually located.

const mockedStorageItems = {
  '1': [
    {
      itemNamePlusActivityName: 'Item1Activity1',
      activityNamePlusId: 'Activity1ID1',
      activityName: 'Activity1',
      activityKey: 'Key1',
    },
  ],
  '2': [
    {
      itemNamePlusActivityName: 'Item2Activity2',
      activityNamePlusId: 'Activity2ID2',
      activityName: 'Activity2',
      activityKey: 'Key2',
    },
  ],
};

describe('getFilteredSelectedItems', () => {
  test('should return all items except for the one with the specified id', () => {
    const filteredItems = getFilteredSelectedItems(mockedStorageItems, '2');
    expect(filteredItems).toEqual({
      '1': [
        {
          itemNamePlusActivityName: 'Item1Activity1',
          activityNamePlusId: 'Activity1ID1',
          activityName: 'Activity1',
          activityKey: 'Key1',
        },
      ],
    });
    expect(filteredItems).not.toHaveProperty('2');
  });
});

describe('getUpdatedSelectedItems', () => {
  test('should return combined items when other items exist besides the selected one', () => {
    const selectedItems = {
      '2': [
        {
          itemNamePlusActivityName: 'Item2Activity3',
          activityNamePlusId: 'Activity2ID3',
          activityName: 'Activity3',
          activityKey: 'Key3',
        },
      ],
    };
    const updatedItems = getUpdatedSelectedItems(mockedStorageItems, selectedItems, '2');
    expect(updatedItems).toEqual({
      '1': [
        {
          itemNamePlusActivityName: 'Item1Activity1',
          activityNamePlusId: 'Activity1ID1',
          activityName: 'Activity1',
          activityKey: 'Key1',
        },
      ],
      '2': [
        {
          itemNamePlusActivityName: 'Item2Activity3',
          activityNamePlusId: 'Activity2ID3',
          activityName: 'Activity3',
          activityKey: 'Key3',
        },
      ],
    });
  });

  test('should return only selected items if no other items are selected', () => {
    const selectedItems = {
      '3': [
        {
          itemNamePlusActivityName: 'Item3Activity4',
          activityNamePlusId: 'Activity3ID4',
          activityName: 'Activity4',
          activityKey: 'Key4',
        },
      ],
    };
    const updatedItems = getUpdatedSelectedItems({}, selectedItems, '3');
    expect(updatedItems).toEqual(selectedItems);
  });
});

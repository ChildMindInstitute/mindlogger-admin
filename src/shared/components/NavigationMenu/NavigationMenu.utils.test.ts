import { getActiveItem } from './NavigationMenu.utils';

const items = [
  {
    label: 'Group 1',
    items: [
      { label: 'Item 1', component: null, icon: null, param: 'item1', isVisible: true },
      { label: 'Item 2', component: null, icon: null, param: 'item2', isVisible: true },
    ],
  },
  {
    label: 'Group 2',
    items: [
      { label: 'Item 3', component: null, icon: null, param: 'item3', isVisible: true },
      { label: 'Item 4', component: null, icon: null, param: 'item4', isVisible: true },
    ],
  },
];

describe('getActiveItem', () => {
  test('should return active item when settingPath is provided', () => {
    const settingPath = 'item2';
    const activeItem = getActiveItem(items, settingPath);

    expect(activeItem).toEqual({
      label: 'Item 2',
      component: null,
      icon: null,
      param: 'item2',
      isVisible: true,
    });
  });

  test('should return null when settingPath is not found', () => {
    const settingPath = 'nonexistentItem';
    const activeItem = getActiveItem(items, settingPath);
    expect(activeItem).toBeNull();
  });

  test('should return null when items is an empty array', () => {
    const settingPath = 'item2';
    const activeItem = getActiveItem([], settingPath);
    expect(activeItem).toBeNull();
  });

  test('should return null when settingPath is undefined', () => {
    const activeItem = getActiveItem(items);
    expect(activeItem).toBeNull();
  });
});

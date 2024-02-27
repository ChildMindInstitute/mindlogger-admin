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
  test.each([
    [
      'should return active item when settingPath is provided',
      'item2',
      {
        label: 'Item 2',
        component: null,
        icon: null,
        param: 'item2',
        isVisible: true,
      },
    ],
    ['should return null when settingPath is not found', 'nonexistentItem', null],
    ['should return null when settingPath is undefined', undefined, null],
  ])('%s', (_, settingPath, expected) => {
    const activeItem = getActiveItem(items, settingPath);
    expect(activeItem).toEqual(expected);
  });
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ConditionalLogicMatch } from 'shared/consts';

import { getConditionsToRemove } from './ActivityItems.utils';

describe('getConditionsToRemove', () => {
  test('returns undefined if conditionalLogic is not provided', () => {
    const items = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];
    const config = { sourceIndex: 0, destinationIndex: 1, item: items[0] };
    const result = getConditionsToRemove({ items, config });
    expect(result).toBeUndefined();
  });

  test('returns undefined if there are no dependent conditions', () => {
    const items = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];
    const conditionalLogic = [
      { match: ConditionalLogicMatch.All, conditions: [{ id: 1, name: 'Condition 1' }] },
    ];
    const config = { sourceIndex: 0, destinationIndex: 1, item: items[0] };
    const result = getConditionsToRemove({ items, config, conditionalLogic });
    expect(result).toBeUndefined();
  });

  test('returns conditions to remove when dependent conditions are to the left of the source item', () => {
    const items = [
      { id: 'item1', name: 'Item 1' },
      { id: 'item2', name: 'Item 2' },
    ];
    const conditionalLogic = [
      {
        match: ConditionalLogicMatch.All,
        itemKey: 'item1',
        conditions: [
          { id: 3, name: 'Condition 3' },
          { id: 4, name: 'Condition 4' },
        ],
      },
    ];
    const config = { sourceIndex: 0, destinationIndex: 1, item: items[0] };
    const result = getConditionsToRemove({ items, config, conditionalLogic });
    expect(result).toEqual([
      {
        conditions: [
          {
            id: 3,
            name: 'Condition 3',
          },
          {
            id: 4,
            name: 'Condition 4',
          },
        ],
        itemKey: 'item1',
        match: 'all',
      },
    ]);
  });
});

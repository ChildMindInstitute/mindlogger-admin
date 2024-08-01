import { getItemsInUsage } from './getItemsInUsage';

describe('getItemsInUsage', () => {
  const conditionalLogic = [
    {
      itemKey: undefined,
    },
    {
      itemKey: 'item-1',
    },
    {
      itemKey: 'item-3',
    },
    {
      itemKey: undefined,
    },
  ];

  test.each`
    conditionalLogic    | itemKey      | expectedArrayInSet      | description
    ${conditionalLogic} | ${'item-2'}  | ${['item-1', 'item-3']} | ${'returns items when current is chosen'}
    ${conditionalLogic} | ${undefined} | ${['item-1', 'item-3']} | ${'returns items when current is empty'}
    ${conditionalLogic} | ${'item-1'}  | ${['item-3']}           | ${'returns filtered items when overlapped'}
    ${undefined}        | ${'item-1'}  | ${[]}                   | ${"returns empty list when conditional's list is empty"}
  `('$description', async ({ conditionalLogic, itemKey, expectedArrayInSet }) => {
    expect(getItemsInUsage({ conditionalLogic, itemKey })).toStrictEqual(
      new Set(expectedArrayInSet),
    );
  });
});

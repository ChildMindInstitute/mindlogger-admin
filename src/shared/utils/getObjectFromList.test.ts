import { getObjectFromList } from './getObjectFromList';

describe('getObjectFromList', () => {
  const items = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ];
  const expected1 = {
    '1': { id: '1', name: 'Item 1' },
    '2': { id: '2', name: 'Item 2' },
  };
  const expected2 = {
    'Item 1': { id: '1', name: 'Item 1' },
    'Item 2': { id: '2', name: 'Item 2' },
  };
  const getUniqueKey = (item: { id: string; name: string }) => item.name;

  test.each`
    items    | expected     | getUniqueKey    | description
    ${[]}    | ${{}}        | ${undefined}    | ${'returns empty object when items array is empty'}
    ${items} | ${expected1} | ${undefined}    | ${'creates an object with unique keys based on ids by default'}
    ${items} | ${expected2} | ${getUniqueKey} | ${'creates an object with unique keys based on a custom key function'}
  `('$description', ({ items, getUniqueKey, expected }) => {
    expect(getObjectFromList(items, getUniqueKey)).toEqual(expected);
  });
});

import { getEntityKey, getObjectFromList, getUniqueName } from './builderHelpers';

describe('getEntityKey', () => {
  const entity1 = { id: '123', key: 'abc' };
  const entity2 = { key: 'abc' };
  const entity3 = { id: '', key: null };

  test.each`
    entity     | useIdFirst | expected       | description
    ${entity1} | ${true}    | ${entity1.id}  | ${'returns id when useIdFirst is true and id is present'}
    ${entity2} | ${true}    | ${entity2.key} | ${'returns the key when useIdFirst is true and id is not present'}
    ${{}}      | ${true}    | ${''}          | ${'returns empty string when useIdFirst is true and no id or key'}
    ${entity1} | ${false}   | ${entity1.key} | ${'returns the key when useIdFirst is false and key is present'}
    ${entity3} | ${false}   | ${''}          | ${'returns an empty string when id and key are falsy'}
  `('$description', ({ entity, useIdFirst, expected }) => {
    expect(getEntityKey(entity, useIdFirst)).toBe(expected);
  });
});

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

describe('getUniqueName', () => {
  const name1 = 'Unique Name';
  const name2 = 'Existing Name';
  const name3 = 'Existing Name (5)';
  const existingNames = [
    'Other Name',
    'Different Name',
    'Existing Name',
    'Existing Name (5)',
    'Existing Name (6)',
  ];
  const expected1 = 'Existing Name (1)';
  const expected2 = 'Existing Name_1';
  const expected3 = 'Existing Name (7)';
  test.each`
    name     | existingNames    | withUnderscore | expected     | description
    ${name1} | ${existingNames} | ${undefined}   | ${name1}     | ${'returns the original name when it is unique'}
    ${name2} | ${existingNames} | ${undefined}   | ${expected1} | ${'appends index in parentheses if already exists'}
    ${name2} | ${existingNames} | ${true}        | ${expected2} | ${'appends underscore index, withUnderscore: true'}
    ${name3} | ${existingNames} | ${undefined}   | ${expected3} | ${'appends next available index in parentheses'}
  `('$description', ({ name, existingNames, withUnderscore, expected }) => {
    expect(getUniqueName({ name, existingNames, withUnderscore })).toBe(expected);
  });
});

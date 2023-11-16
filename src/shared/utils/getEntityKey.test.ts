import { getEntityKey } from './getEntityKey';

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

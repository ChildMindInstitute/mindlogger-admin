import { getUniqueName } from './getUniqueName';

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

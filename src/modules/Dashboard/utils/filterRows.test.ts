import { filterRows } from './filterRows';

const mockedItem = {
  content: () => 'Mocked Content',
  value: 'Mocked Value',
};

describe('filterRows function', () => {
  test.each`
    searchValue             | expected | description
    ${'Mocked Value'}       | ${true}  | ${'return true when searchValue matches item value'}
    ${'mocked'}             | ${true}  | ${'return true when searchValue partially matches item value'}
    ${'mocked value'}       | ${true}  | ${'return true when searchValue matches item value (case-insensitive)'}
    ${'Non-Matching Value'} | ${false} | ${'return false when searchValue does not match item value'}
  `('$description', ({ searchValue, expected }) => {
    expect(filterRows(mockedItem, searchValue)).toEqual(expected);
  });
});

import { filterRows } from './filterRows';

const mockedItem = {
  content: () => 'Mocked Content',
  value: 'Mocked Value',
};

describe('filterRows function', () => {
  it('should return true when searchValue matches item value', () => {
    const searchValue = 'Mocked Value';
    expect(filterRows(mockedItem, searchValue)).toBe(true);
  });

  it('should return true when searchValue partially matches item value', () => {
    const searchValue = 'mocked';
    expect(filterRows(mockedItem, searchValue)).toBe(true);
  });

  it('should return true when searchValue matches item value (case-insensitive)', () => {
    const searchValue = 'mocked value';
    expect(filterRows(mockedItem, searchValue)).toBe(true);
  });

  it('should return false when searchValue does not match item value', () => {
    const searchValue = 'Non-Matching Value';
    expect(filterRows(mockedItem, searchValue)).toBe(false);
  });
});

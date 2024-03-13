import { getTableRowClassNames } from './AppletsTable.utils';

describe('getTableRowClassNames', () => {
  test.each([
    [{ hasHover: true, isDragOver: true }, 'dragged-over has-hover'],
    [{ hasHover: true, isDragOver: false }, 'has-hover'],
    [{ hasHover: false, isDragOver: true }, 'dragged-over'],
    [{ hasHover: false, isDragOver: false }, ''],
  ])('should return correct class names', (input, expected) => {
    expect(getTableRowClassNames(input)).toBe(expected);
  });
});

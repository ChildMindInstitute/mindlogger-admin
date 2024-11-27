import { getTableRowClassNames } from './AppletsTable.utils';

describe('getTableRowClassNames', () => {
  test.each([
    [{ hasHover: true, isDragOver: true }, 'MuiTableRow-dragged-over MuiTableRow-has-hover'],
    [{ hasHover: true, isDragOver: false }, 'MuiTableRow-has-hover'],
    [{ hasHover: false, isDragOver: true }, 'MuiTableRow-dragged-over'],
    [{ hasHover: false, isDragOver: false }, ''],
  ])('should return correct class names', (input, expected) => {
    expect(getTableRowClassNames(input)).toBe(expected);
  });
});

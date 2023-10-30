import { filterReportTable } from './ReportTable.utils';

describe('filterReportTable', () => {
  test.each`
    item                  | searchValue      | expectedResult | description
    ${'Sample Text'}      | ${'Sample'}      | ${true}        | ${'should return true if item includes searchValue'}
    ${'Case-Insensitive'} | ${'insensitive'} | ${true}        | ${'should handle case-insensitive search'}
    ${'No Match'}         | ${'searchValue'} | ${false}       | ${'should return false if item does not include searchValue'}
    ${null}               | ${'searchValue'} | ${false}       | ${'should return false if item is null'}
  `('$description', ({ item, searchValue, expectedResult }) => {
    const result = filterReportTable(item, searchValue);
    expect(result).toBe(expectedResult);
  });
});

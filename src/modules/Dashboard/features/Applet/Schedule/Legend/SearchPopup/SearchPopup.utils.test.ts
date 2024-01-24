import { filterRows } from './SearchPopup.utils';

describe('filterRows', () => {
  test.each`
    item         | searchValue | expectedResult
    ${'Apple'}   | ${'app'}    | ${true}
    ${'Apple'}   | ${'APP'}    | ${true}
    ${'Orange'}  | ${'nge'}    | ${true}
    ${''}        | ${'ora'}    | ${false}
    ${undefined} | ${'qwerty'} | ${false}
    ${null}      | ${'qwerty'} | ${false}
  `(
    'should return $expectedResult for item "$item" and searchValue "$searchValue"',
    ({ item, searchValue, expectedResult }) => {
      const result = filterRows(item, searchValue);
      expect(result).toBe(expectedResult);
    },
  );
});

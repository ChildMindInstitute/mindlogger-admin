import { getLatestReportUrl, sortResponseOptions } from './Report.utils';

describe('getLatestReportUrl', () => {
  test.each([
    ['...', `data:application/pdf;base64,...`],
    ['', 'data:application/pdf;base64,'],
  ])(
    'should return a valid data URL for a PDF with the given base64 string',
    (base64Str, expectedUrl) => {
      const result = getLatestReportUrl(base64Str);
      expect(result).toEqual(expectedUrl);
    },
  );
});

describe('sortResponseOptions', () => {
  test('should sort response options by order, then by key', () => {
    const mockResponseOptions = {
      b: [{ activityItem: { order: 4 } }],
      a: [{ activityItem: { order: 2 } }],
      c: [{ activityItem: { order: 3 } }],
      d: [{ activityItem: { order: 1 } }],
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const sorted = sortResponseOptions(mockResponseOptions);
    const expectedKeysOrder = ['d', 'a', 'c', 'b'];
    const actualKeysOrder = Object.keys(sorted);
    expect(actualKeysOrder).toEqual(expectedKeysOrder);
  });

  test('should handle an empty object', () => {
    expect(sortResponseOptions({})).toEqual({});
  });
});

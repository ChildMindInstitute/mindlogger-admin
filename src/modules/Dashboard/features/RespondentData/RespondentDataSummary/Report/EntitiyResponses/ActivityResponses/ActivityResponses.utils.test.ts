import { sortResponseOptions } from './ActivityResponses.utils';

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

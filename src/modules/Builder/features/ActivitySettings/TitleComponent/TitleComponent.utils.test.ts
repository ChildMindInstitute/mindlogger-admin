import { getErrorMessages } from './TitleComponent.utils';

describe('TitleComponent utils', () => {
  describe('getErrorMessages', () => {
    const testCases = [
      {
        description: 'should return error messages for each key in the errorObject',
        errorObject: {
          conditions: [
            { key1: 'test', key2: 'test2', key3: 'test3' },
            { key1: 'test', key2: 'test2' },
            {},
          ],
          otherKey: { message: 'Other key error message' },
        },
        expected: [
          { key: 'conditions-0', message: 'Set up at least one condition' },
          { key: 'conditions-1', message: 'Set up correct condition' },
          { key: 'conditions-2', message: 'Set up correct condition' },
          { key: 'otherKey', message: 'Other key error message' },
        ],
      },
      {
        description: 'should handle errorObject with missing conditions key',
        errorObject: {
          firstKey: { message: 'First key error message' },
          otherKey: { message: 'Other key error message' },
        },
        expected: [
          { key: 'firstKey', message: 'First key error message' },
          { key: 'otherKey', message: 'Other key error message' },
        ],
      },
      {
        description: 'should handle empty conditions array',
        errorObject: {
          conditions: [],
          otherKey: { message: 'Other key error message' },
        },
        expected: [{ key: 'otherKey', message: 'Other key error message' }],
      },
      {
        description: 'should handle empty errorObject',
        errorObject: {},
        expected: [],
      },
    ];

    test.each(testCases)('$description', ({ errorObject, expected }) => {
      const result = getErrorMessages(errorObject);

      expect(result).toEqual(expected);
    });
  });
});

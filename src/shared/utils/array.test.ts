import { createArray, groupBy, pluck, createArrayFromMinToMax } from './array';

describe('createArray', () => {
  test('creates an array of the specified length using the provided mapper', () => {
    const result = createArray(5, (index) => index * 2);
    const expected = [0, 2, 4, 6, 8];

    expect(result).toEqual(expected);
  });

  test('creates an empty array when length is 0', () => {
    const result = createArray(0, () => 'item');
    const expected: string[] = [];

    expect(result).toEqual(expected);
  });
});

describe('groupBy', () => {
  test('groups an array of objects by a key', () => {
    const array = [
      { id: 1, category: 'A' },
      { id: 2, category: 'B' },
      { id: 3, category: 'A' },
    ];

    const result = groupBy(array, 'category');
    const expected = {
      A: [
        { id: 1, category: 'A' },
        { id: 3, category: 'A' },
      ],
      B: [{ id: 2, category: 'B' }],
    };

    expect(result).toEqual(expected);
  });

  test('groups an array of objects using a custom mapper function', () => {
    const array = [
      { id: 1, value: 5 },
      { id: 2, value: 8 },
      { id: 3, value: 5 },
    ];

    const result = groupBy(array, (item) => item.value);
    const expected = {
      '5': [
        { id: 1, value: 5 },
        { id: 3, value: 5 },
      ],
      '8': [{ id: 2, value: 8 }],
    };

    expect(result).toEqual(expected);
  });
});

describe('pluck', () => {
  test('extracts values from an array of objects based on the specified attribute', () => {
    const array = [
      { name: 'John', age: 25 },
      { name: 'Jane', age: 30 },
      { name: 'Bob', age: 22 },
    ];

    const result = pluck(array, 'name');
    const expected = ['John', 'Jane', 'Bob'];

    expect(result).toEqual(expected);
  });

  test('returns an empty array when the input array is empty', () => {
    const result = pluck([], 'attribute');
    const expected: string[] = [];

    expect(result).toEqual(expected);
  });

  test('handles nested attributes using dot notation', () => {
    const array = [
      { person: { name: 'John' } },
      { person: { name: 'Jane' } },
      { person: { name: 'Bob' } },
    ];

    const result = pluck(array, 'person.name');
    const expected = ['John', 'Jane', 'Bob'];

    expect(result).toEqual(expected);
  });
});

describe('createArrayFromMinToMax', () => {
  test('creates an array of numbers from min to max (inclusive)', () => {
    const result = createArrayFromMinToMax(3, 7);
    const expected = [3, 4, 5, 6, 7];

    expect(result).toEqual(expected);
  });

  test('creates an array with a single element when min and max are the same', () => {
    const result = createArrayFromMinToMax(5, 5);
    const expected = [5];

    expect(result).toEqual(expected);
  });

  test('creates an empty array when min is greater than max', () => {
    const result = createArrayFromMinToMax(10, 5);
    const expected: number[] = [];

    expect(result).toEqual(expected);
  });
});

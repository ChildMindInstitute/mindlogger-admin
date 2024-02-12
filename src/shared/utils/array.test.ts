import { createArray, groupBy, pluck, createArrayFromMinToMax } from './array';

describe('createArray', () => {
  const mapper1 = (index: number) => index * 2;
  test.each`
    length | mapper          | expected           | description
    ${5}   | ${mapper1}      | ${[0, 2, 4, 6, 8]} | ${'creates an array of the specified length with mapper'}
    ${0}   | ${() => 'item'} | ${[]}              | ${'creates an empty array when length is 0'}
  `('$description', ({ length, mapper, expected }) => {
    expect(createArray(length, mapper)).toEqual(expected);
  });
});

describe('groupBy', () => {
  const array1 = [
    { id: 1, category: 'A' },
    { id: 2, category: 'B' },
    { id: 3, category: 'A' },
  ];
  const expected1 = {
    A: [
      { id: 1, category: 'A' },
      { id: 3, category: 'A' },
    ],
    B: [{ id: 2, category: 'B' }],
  };
  const array2 = [
    { id: 1, value: 5 },
    { id: 2, value: 8 },
    { id: 3, value: 5 },
  ];
  const mapper2 = (item: { id: number; value: number }) => item.value;
  const expected2 = {
    '5': [
      { id: 1, value: 5 },
      { id: 3, value: 5 },
    ],
    '8': [{ id: 2, value: 8 }],
  };

  test.each`
    array     | map           | expected     | description
    ${array1} | ${'category'} | ${expected1} | ${'groups an array of objects by key'}
    ${array2} | ${mapper2}    | ${expected2} | ${'groups an array of objects using a custom mapper function'}
  `('$description', ({ array, map, expected }) => {
    expect(groupBy(array, map)).toEqual(expected);
  });
});

describe('pluck', () => {
  const array1 = [
    { name: 'John', age: 25 },
    { name: 'Jane', age: 30 },
    { name: 'Bob', age: 22 },
  ];
  const array2 = [
    { person: { name: 'John' } },
    { person: { name: 'Jane' } },
    { person: { name: 'Bob' } },
  ];
  const expected = ['John', 'Jane', 'Bob'];

  test.each`
    array     | attribute        | expected    | description
    ${array1} | ${'name'}        | ${expected} | ${'extracts values based on the specified attribute'}
    ${[]}     | ${'attribute'}   | ${[]}       | ${'returns an empty array when the input array is empty'}
    ${array2} | ${'person.name'} | ${expected} | ${'handles nested attributes using dot notation'}
  `('$description', ({ array, attribute, expected }) => {
    expect(pluck(array, attribute)).toEqual(expected);
  });
});

describe('createArrayFromMinToMax', () => {
  test.each`
    min   | max    | expected           | description
    ${3}  | ${7}   | ${[3, 4, 5, 6, 7]} | ${'returns range of values'}
    ${5}  | ${5}   | ${[5]}             | ${'returns one item in array for same boundaries'}
    ${10} | ${[5]} | ${[]}              | ${'returns empty array when the borders change sides'}
  `('$description', ({ min, max, expected }) => {
    expect(createArrayFromMinToMax(min, max)).toEqual(expected);
  });
});

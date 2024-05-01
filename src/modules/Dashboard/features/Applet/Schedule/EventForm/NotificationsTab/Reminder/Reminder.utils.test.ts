import { findClosestValues } from './Reminder.utils';

const arr1 = [
  0, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98, 105, 112, 119, 126, 133, 140, 147, 154,
  161, 168, 175, 182, 189, 196, 203, 210, 217, 224, 231, 238, 245, 252, 259, 266,
];
const arr2 = [5, 10, 15, 20];

describe('findClosestValues', () => {
  test.each([
    [arr1, 32, { closestBefore: 28, closestAfter: 35 }],
    [arr2, 2, { closestBefore: -Infinity, closestAfter: 5 }],
    [arr2, 25, { closestBefore: 20, closestAfter: Infinity }],
    [[], 5, { closestBefore: -Infinity, closestAfter: Infinity }],
  ])('findClosestValues for %p', (arr, target, expected) => {
    const result = findClosestValues(arr, target);
    expect(result).toEqual(expected);
  });
});

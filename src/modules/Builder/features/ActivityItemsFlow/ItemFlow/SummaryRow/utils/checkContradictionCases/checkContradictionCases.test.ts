import { ConditionType } from 'shared/consts';

import {
  checkBetweenOutside,
  checkGreaterLessNotEqual,
  checkGreaterLessOutside,
  checkNotEqualBetween,
  checkNotEqualOutside,
} from './checkContradictionCases';
import {
  CheckBetweenOutside,
  CheckGreaterLessNotEqual,
  CheckGreaterLessOutside,
  CheckNotEqualBetween,
  CheckNotEqualOutside,
} from './checkContradictionCases.types';

describe('checkContradictionCases', () => {
  describe('checkGreaterLessNotEqual', () => {
    const cases: [string, CheckGreaterLessNotEqual, boolean][] = [
      [
        'returns true for GreaterThan comparison when all values after compareValue are in notEqualArray',
        {
          compareValue: 5,
          notEqualArray: [6, 7, 8, 9, 10],
          validRange: { min: 0, max: 10 },
          comparisonType: ConditionType.GreaterThan,
        },
        true,
      ],
      [
        'returns false for GreaterThan comparison when not all values after compareValue are in notEqualArray',
        {
          compareValue: 5,
          notEqualArray: [6, 7, 9, 10],
          validRange: { min: 0, max: 10 },
          comparisonType: ConditionType.GreaterThan,
        },
        false,
      ],
      [
        'returns true for LessThan comparison when all values before compareValue are in notEqualArray',
        {
          compareValue: 5,
          notEqualArray: [0, 1, 2, 3, 4],
          validRange: { min: 0, max: 10 },
          comparisonType: ConditionType.LessThan,
        },
        true,
      ],
      [
        'returns false for LessThan comparison when not all values before compareValue are in notEqualArray',
        {
          compareValue: 5,
          notEqualArray: [0, 1, 3, 4],
          validRange: { min: 0, max: 10 },
          comparisonType: ConditionType.LessThan,
        },
        false,
      ],
      [
        'returns false for invalid comparisonType',
        {
          compareValue: 5,
          notEqualArray: [0, 1, 2, 3, 4],
          validRange: { min: 0, max: 10 },
          comparisonType: 'InvalidType' as ConditionType.LessThan,
        },
        false,
      ],
    ];

    test.each(cases)('%s', (_, props, expected) => {
      expect(checkGreaterLessNotEqual(props)).toBe(expected);
    });
  });

  describe('checkGreaterLessOutside', () => {
    const cases: [string, CheckGreaterLessOutside, boolean][] = [
      [
        'returns false for GreaterThan comparison when compareValue does not overlap with outsideRange',
        {
          compareValue: 5,
          outsideRange: { min: 8, max: 10 },
          validRange: { min: 0, max: 15 },
          comparisonType: ConditionType.GreaterThan,
        },
        false,
      ],
      [
        'returns false for GreaterThan comparison when compareValue overlaps with outsideRange',
        {
          compareValue: 5,
          outsideRange: { min: 6, max: 10 },
          validRange: { min: 0, max: 15 },
          comparisonType: ConditionType.GreaterThan,
        },
        false,
      ],
      [
        'returns false for LessThan comparison when compareValue does not overlap with outsideRange',
        {
          compareValue: 5,
          outsideRange: { min: 0, max: 2 },
          validRange: { min: 0, max: 10 },
          comparisonType: ConditionType.LessThan,
        },
        false,
      ],
      [
        'returns false for LessThan comparison when compareValue overlaps with outsideRange',
        {
          compareValue: 5,
          outsideRange: { min: 3, max: 7 },
          validRange: { min: 0, max: 10 },
          comparisonType: ConditionType.LessThan,
        },
        false,
      ],
      [
        'returns false for invalid comparisonType',
        {
          compareValue: 5,
          outsideRange: { min: 0, max: 2 },
          validRange: { min: 0, max: 10 },
          comparisonType: 'InvalidType' as ConditionType.GreaterThan,
        },
        false,
      ],
    ];

    test.each(cases)('%s', (_, input, expected) => {
      expect(checkGreaterLessOutside(input)).toBe(expected);
    });
  });

  describe('checkNotEqualBetween', () => {
    const cases: [string, CheckNotEqualBetween, boolean][] = [
      [
        'returns true when all values between min and max are in notEqualSetUnion',
        {
          betweenUnion: [5, 10],
          notEqualSetUnion: [6, 7, 8, 9],
        },
        true,
      ],
      [
        'returns false when not all values between min and max are in notEqualSetUnion',
        {
          betweenUnion: [5, 10],
          notEqualSetUnion: [6, 7, 9],
        },
        false,
      ],
      [
        'returns true when there are no values between min and max',
        {
          betweenUnion: [5, 6],
          notEqualSetUnion: [],
        },
        true,
      ],
      [
        'returns false when notEqualSetUnion is empty and there are values between min and max',
        {
          betweenUnion: [5, 10],
          notEqualSetUnion: [],
        },
        false,
      ],
    ];

    test.each(cases)('%s', (_, input, expected) => {
      expect(checkNotEqualBetween(input)).toBe(expected);
    });
  });

  describe('checkNotEqualOutside', () => {
    const cases: [string, CheckNotEqualOutside, boolean][] = [
      [
        'returns true when all values outside the range are in notEqualSetUnion',
        {
          outsideOfUnion: [5, 10],
          notEqualSetUnion: [0, 1, 2, 3, 4, 11, 12, 13, 14, 15],
          minValue: 0,
          maxValue: 15,
        },
        true,
      ],
      [
        'returns false when not all values outside the range are in notEqualSetUnion',
        {
          outsideOfUnion: [5, 10],
          notEqualSetUnion: [1, 3, 4, 11, 13],
          minValue: 0,
          maxValue: 15,
        },
        false,
      ],
      [
        'returns true when the range covers the entire set of values',
        {
          outsideOfUnion: [0, 15],
          notEqualSetUnion: [],
          minValue: 0,
          maxValue: 15,
        },
        true,
      ],
      [
        'returns false when the notEqualSetUnion is empty and there are values outside the range',
        {
          outsideOfUnion: [5, 10],
          notEqualSetUnion: [],
          minValue: 0,
          maxValue: 15,
        },
        false,
      ],
    ];

    test.each(cases)('%s', (_, input, expected) => {
      expect(checkNotEqualOutside(input)).toBe(expected);
    });
  });

  describe('checkBetweenOutside', () => {
    const cases: [string, CheckBetweenOutside, boolean][] = [
      [
        'returns true when the betweenUnion and outsideOfUnion ranges are overlapping and meet the conditions',
        {
          betweenUnion: [3, 5],
          outsideOfUnion: [4, 10],
        },
        true,
      ],
      [
        'returns false when the betweenUnion range overlaps with the outsideOfUnion range',
        {
          betweenUnion: [3, 9],
          outsideOfUnion: [7, 10],
        },
        false,
      ],
      [
        'returns false when the minBetween is greater than or equal to maxOutside',
        {
          betweenUnion: [10, 12],
          outsideOfUnion: [7, 9],
        },
        false,
      ],
      [
        'returns false when the minOutside - minBetween is greater than 1',
        {
          betweenUnion: [1, 3],
          outsideOfUnion: [5, 8],
        },
        false,
      ],
      [
        'returns false when the maxBetween - maxOutside is greater than 1',
        {
          betweenUnion: [2, 5],
          outsideOfUnion: [1, 3],
        },
        false,
      ],
    ];

    test.each(cases)('%s', (_, input, expected) => {
      expect(checkBetweenOutside(input)).toBe(expected);
    });
  });
});

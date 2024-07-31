import { ConditionType } from 'shared/consts';

import {
  CheckBetweenOutside,
  CheckGreaterLessNotEqual,
  CheckGreaterLessOutside,
  CheckNotEqualBetween,
  CheckNotEqualOutside,
} from './checkContradictionCases.types';

export const checkGreaterLessNotEqual = ({
  compareValue,
  notEqualArray,
  validRange,
  comparisonType,
}: CheckGreaterLessNotEqual) => {
  const notEqualSet = new Set(notEqualArray);
  const { min, max } = validRange;

  if (comparisonType === ConditionType.GreaterThan) {
    for (let value = compareValue + 1; value <= max; value++) {
      if (!notEqualSet.has(value)) {
        return false;
      }
    }

    return true;
  } else if (comparisonType === ConditionType.LessThan) {
    for (let value = compareValue - 1; value >= min; value--) {
      if (!notEqualSet.has(value)) {
        return false;
      }
    }

    return true;
  }

  return false;
};

export const checkGreaterLessOutside = ({
  compareValue,
  outsideRange,
  validRange,
  comparisonType,
}: CheckGreaterLessOutside) => {
  if (comparisonType === ConditionType.GreaterThan) {
    const greaterThanStart = compareValue + 1;
    const greaterThanEnd = validRange.max;

    const outsideStart1 = validRange.min;
    const outsideEnd1 = outsideRange.min - 1;
    const outsideStart2 = outsideRange.max + 1;
    const outsideEnd2 = validRange.max;

    const overlapsWithOutsideRange1 =
      greaterThanStart <= outsideEnd1 && greaterThanEnd >= outsideStart1;
    const overlapsWithOutsideRange2 =
      greaterThanStart <= outsideEnd2 && greaterThanEnd >= outsideStart2;

    return !(overlapsWithOutsideRange1 || overlapsWithOutsideRange2);
  } else if (comparisonType === ConditionType.LessThan) {
    const lessThanStart = validRange.min;
    const lessThanEnd = compareValue - 1;

    const outsideStart1 = validRange.min;
    const outsideEnd1 = outsideRange.min - 1;
    const outsideStart2 = outsideRange.max + 1;
    const outsideEnd2 = validRange.max;

    const overlapsWithOutsideRange1 = lessThanStart <= outsideEnd1 && lessThanEnd >= outsideStart1;
    const overlapsWithOutsideRange2 = lessThanStart <= outsideEnd2 && lessThanEnd >= outsideStart2;

    return !(overlapsWithOutsideRange1 || overlapsWithOutsideRange2);
  }

  return false;
};

export const checkNotEqualBetween = ({ betweenUnion, notEqualSetUnion }: CheckNotEqualBetween) => {
  const [min, max] = betweenUnion;

  for (let value = min + 1; value < max; value++) {
    if (!notEqualSetUnion.includes(value)) {
      return false;
    }
  }

  return true;
};

export const checkNotEqualOutside = ({
  outsideOfUnion,
  notEqualSetUnion,
  minValue,
  maxValue,
}: CheckNotEqualOutside) => {
  const [minRange, maxRange] = outsideOfUnion;
  const notEqualSet = new Set(notEqualSetUnion);

  return Array.from({ length: maxValue - minValue + 1 }, (_, i) => minValue + i)
    .filter((value) => value < minRange || value > maxRange)
    .every((value) => notEqualSet.has(value));
};

export const checkBetweenOutside = ({ betweenUnion, outsideOfUnion }: CheckBetweenOutside) => {
  const [minBetween, maxBetween] = betweenUnion;
  const [minOutside, maxOutside] = outsideOfUnion;

  if (minBetween >= maxOutside) return false;
  if (minOutside - minBetween > 1) return false;
  if (maxBetween - maxOutside > 1) return false;

  return true;
};

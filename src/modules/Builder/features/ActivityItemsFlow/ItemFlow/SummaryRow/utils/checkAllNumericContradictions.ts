import { ConditionType } from 'shared/consts';

import {
  checkBetweenOutside,
  checkGreaterLessNotEqual,
  checkGreaterLessOutside,
  checkNotEqualBetween,
  checkNotEqualOutside,
} from './checkContradictionCases';
import { CheckAllNumericContradictions } from '../SummaryRow.types';

export const checkAllNumericContradictions = ({
  lessThanValue,
  greaterThanValue,
  equalSetUnion,
  notEqualSetUnion,
  betweenUnion,
  outsideOfUnion,
  minValue,
  maxValue,
}: CheckAllNumericContradictions) => {
  if (
    lessThanValue !== undefined &&
    greaterThanValue !== undefined &&
    lessThanValue - greaterThanValue <= 1
  ) {
    // Check "greaterThanValue" and "lessThanValue" contradiction
    return true;
  }

  if (
    greaterThanValue !== undefined &&
    equalSetUnion !== undefined &&
    equalSetUnion.some((value) => value <= greaterThanValue)
  ) {
    // Check "greaterThanValue" and "isEqualTo" contradiction
    return true;
  }

  if (
    greaterThanValue !== undefined &&
    notEqualSetUnion !== undefined &&
    checkGreaterLessNotEqual({
      compareValue: greaterThanValue,
      notEqualArray: notEqualSetUnion,
      validRange: { min: minValue, max: maxValue },
      comparisonType: ConditionType.GreaterThan,
    })
  ) {
    // Check "greaterThanValue" and "isNotEqualTo" contradiction
    return true;
  }

  if (
    greaterThanValue !== undefined &&
    betweenUnion?.length === 2 &&
    greaterThanValue + 1 >= betweenUnion[1]
  ) {
    // Check "greaterThanValue" and "betweenValues" contradiction
    return true;
  }

  if (
    greaterThanValue !== undefined &&
    outsideOfUnion?.length === 2 &&
    checkGreaterLessOutside({
      compareValue: greaterThanValue,
      outsideRange: { min: outsideOfUnion[0], max: outsideOfUnion[1] },
      validRange: { min: minValue, max: maxValue },
      comparisonType: ConditionType.GreaterThan,
    })
  ) {
    // Check "greaterThanValue" and "outsideOfValues" contradiction
    return true;
  }

  if (
    lessThanValue !== undefined &&
    equalSetUnion !== undefined &&
    equalSetUnion.some((value) => value >= lessThanValue)
  ) {
    // Check "lessThanValue" and "isEqualTo" contradiction
    return true;
  }

  if (
    lessThanValue !== undefined &&
    notEqualSetUnion !== undefined &&
    checkGreaterLessNotEqual({
      compareValue: lessThanValue,
      notEqualArray: notEqualSetUnion,
      validRange: { min: minValue, max: maxValue },
      comparisonType: ConditionType.LessThan,
    })
  ) {
    // Check "lessThanValue" and "isNotEqualTo" contradiction
    return true;
  }

  if (
    lessThanValue !== undefined &&
    betweenUnion?.length === 2 &&
    lessThanValue - 1 <= betweenUnion[0]
  ) {
    // Check "lessThanValue" and "betweenValues" contradiction
    return true;
  }

  if (
    lessThanValue !== undefined &&
    outsideOfUnion?.length === 2 &&
    checkGreaterLessOutside({
      compareValue: lessThanValue,
      outsideRange: { min: outsideOfUnion[0], max: outsideOfUnion[1] },
      validRange: { min: minValue, max: maxValue },
      comparisonType: ConditionType.LessThan,
    })
  ) {
    // Check "lessThanValue" and "outsideOfValues" contradiction
    return true;
  }

  if (equalSetUnion !== undefined && Array.from(new Set(equalSetUnion)).length > 1) {
    // Check "equalTo" contradiction
    return true;
  }

  if (
    equalSetUnion !== undefined &&
    notEqualSetUnion !== undefined &&
    equalSetUnion.some((value) => notEqualSetUnion.includes(value))
  ) {
    // Check "equalTo" and "isNotEqualTo" contradiction
    return true;
  }

  if (
    equalSetUnion !== undefined &&
    betweenUnion?.length === 2 &&
    equalSetUnion.some((value) => value <= betweenUnion[0] || value >= betweenUnion[1])
  ) {
    // Check "equalTo" and "betweenValues" contradiction
    return true;
  }

  if (
    equalSetUnion !== undefined &&
    outsideOfUnion?.length === 2 &&
    equalSetUnion.some((value) => value >= outsideOfUnion[0] && value <= outsideOfUnion[1])
  ) {
    // Check "equalTo" and "outsideValues" contradiction
    return true;
  }

  if (
    notEqualSetUnion !== undefined &&
    betweenUnion?.length === 2 &&
    checkNotEqualBetween({ betweenUnion, notEqualSetUnion })
  ) {
    // Check "inNotEqualTo" and "betweenValues" contradiction
    return true;
  }

  if (
    notEqualSetUnion !== undefined &&
    outsideOfUnion?.length === 2 &&
    checkNotEqualOutside({ outsideOfUnion, notEqualSetUnion, minValue, maxValue })
  ) {
    // Check "inNotEqualTo" and "outsideValues" contradiction
    return true;
  }

  if (
    betweenUnion?.length === 2 &&
    outsideOfUnion?.length === 2 &&
    checkBetweenOutside({ betweenUnion, outsideOfUnion })
  ) {
    // Check "between" and "outsideValues" contradiction
    return true;
  }

  return false;
};

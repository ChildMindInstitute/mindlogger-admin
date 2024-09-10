import { ConditionType } from 'shared/consts';

import {
  checkBetweenOutside,
  checkGreaterLessNotEqual,
  checkGreaterLessOutside,
  checkNotEqualBetween,
  checkNotEqualOutside,
} from '../checkContradictionCases/checkContradictionCases';
import { CheckAllNumericContradictions } from './checkAllNumericContradictions.types';

const isVariableDefined = (value: unknown): value is number | string | boolean | object =>
  value !== undefined && value !== null;

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
    isVariableDefined(lessThanValue) &&
    isVariableDefined(greaterThanValue) &&
    lessThanValue - greaterThanValue <= 1
  ) {
    // Check "greaterThanValue" and "lessThanValue" contradiction
    return true;
  }

  if (
    isVariableDefined(greaterThanValue) &&
    isVariableDefined(equalSetUnion) &&
    equalSetUnion.some((value) => value <= greaterThanValue)
  ) {
    // Check "greaterThanValue" and "isEqualTo" contradiction
    return true;
  }

  if (
    isVariableDefined(greaterThanValue) &&
    isVariableDefined(notEqualSetUnion) &&
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
    isVariableDefined(greaterThanValue) &&
    betweenUnion?.length === 2 &&
    greaterThanValue + 1 >= betweenUnion[1]
  ) {
    // Check "greaterThanValue" and "betweenValues" contradiction
    return true;
  }

  if (
    isVariableDefined(greaterThanValue) &&
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
    isVariableDefined(lessThanValue) &&
    isVariableDefined(equalSetUnion) &&
    equalSetUnion.some((value) => value >= lessThanValue)
  ) {
    // Check "lessThanValue" and "isEqualTo" contradiction
    return true;
  }

  if (
    isVariableDefined(lessThanValue) &&
    isVariableDefined(notEqualSetUnion) &&
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
    isVariableDefined(lessThanValue) &&
    betweenUnion?.length === 2 &&
    lessThanValue - 1 <= betweenUnion[0]
  ) {
    // Check "lessThanValue" and "betweenValues" contradiction
    return true;
  }

  if (
    isVariableDefined(lessThanValue) &&
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

  if (isVariableDefined(equalSetUnion) && Array.from(new Set(equalSetUnion)).length > 1) {
    // Check "equalTo" contradiction
    return true;
  }

  if (
    isVariableDefined(equalSetUnion) &&
    isVariableDefined(notEqualSetUnion) &&
    equalSetUnion.some((value) => notEqualSetUnion.includes(value))
  ) {
    // Check "equalTo" and "isNotEqualTo" contradiction
    return true;
  }

  if (
    isVariableDefined(equalSetUnion) &&
    betweenUnion?.length === 2 &&
    equalSetUnion.some((value) => value <= betweenUnion[0] || value >= betweenUnion[1])
  ) {
    // Check "equalTo" and "betweenValues" contradiction
    return true;
  }

  if (
    isVariableDefined(equalSetUnion) &&
    outsideOfUnion?.length === 2 &&
    equalSetUnion.some((value) => value >= outsideOfUnion[0] && value <= outsideOfUnion[1])
  ) {
    // Check "equalTo" and "outsideValues" contradiction
    return true;
  }

  if (
    isVariableDefined(notEqualSetUnion) &&
    betweenUnion?.length === 2 &&
    checkNotEqualBetween({ betweenUnion, notEqualSetUnion })
  ) {
    // Check "isNotEqualTo" and "betweenValues" contradiction
    return true;
  }

  if (
    isVariableDefined(notEqualSetUnion) &&
    outsideOfUnion?.length === 2 &&
    checkNotEqualOutside({ outsideOfUnion, notEqualSetUnion, minValue, maxValue })
  ) {
    // Check "isNotEqualTo" and "outsideValues" contradiction
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

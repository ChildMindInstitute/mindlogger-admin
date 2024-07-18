import { ConditionType, ItemResponseType } from 'shared/consts';

import {
  CombinedConditionType,
  ConditionWithSetType,
  EqualValueType,
  RangeType,
  ResponseTypeForSetType,
  SingleValueType,
} from '../SummaryRow.types';
import { getCombinedRangeForCondition } from './getCombinedRangeForCondition';
import {
  checkBetweenOutside,
  checkGreaterLessNotEqual,
  checkGreaterLessOutside,
  checkNotEqualBetween,
  checkNotEqualOutside,
} from './checkContradictionCases';

export const getCombinedConditionsByType = <T extends ConditionWithSetType>({
  responseType,
  conditions,
  minValue,
  maxValue,
}: {
  responseType: ResponseTypeForSetType;
  conditions: ConditionWithSetType[];
  minValue: number;
  maxValue: number;
}) => {
  const groupedCondition = conditions.reduce(
    (acc, condition) => {
      const conditionObject = condition as T;
      const conditionType = conditionObject.type;
      if (!conditionType) return acc;

      if (!acc[conditionType])
        return {
          ...acc,
          [conditionType]: getCombinedRangeForCondition(responseType, conditionType, [
            undefined,
            condition,
          ]),
        };

      const combinedCondition = getCombinedRangeForCondition(responseType, conditionType, [
        acc[conditionType],
        condition,
      ]);

      return { ...acc, [conditionType]: combinedCondition };
    },
    {} as { [k in ConditionType]?: CombinedConditionType }, //Record<ConditionType, CombinedConditionType>
  );

  switch (responseType) {
    case ItemResponseType.Time:
    case ItemResponseType.Date:
    case ItemResponseType.Slider:
    case ItemResponseType.NumberSelection: {
      const outsideOfUnion = (groupedCondition[ConditionType.OutsideOf] as RangeType | undefined)
        ?.range;
      const betweenUnion = (groupedCondition[ConditionType.Between] as RangeType | undefined)
        ?.range;
      const lessThanValue = (
        groupedCondition[ConditionType.LessThan] as SingleValueType | undefined
      )?.value;
      const greaterThanValue = (
        groupedCondition[ConditionType.GreaterThan] as SingleValueType | undefined
      )?.value;
      const equalSetUnion = (groupedCondition[ConditionType.Equal] as EqualValueType | undefined)
        ?.value;
      const notEqualSetUnion = (
        groupedCondition[ConditionType.NotEqual] as EqualValueType | undefined
      )?.value;

      console.log({
        outsideOfUnion,
        betweenUnion,
        lessThanValue,
        greaterThanValue,
        equalSetUnion,
        notEqualSetUnion,
        minValue,
        maxValue,
      });

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
    }
    case ItemResponseType.TimeRange: {
      return false;
    }
    case ItemResponseType.SliderRows: {
      return false;
    }
  }
};

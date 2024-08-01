import { ConditionType, ItemResponseType } from 'shared/consts';

import {
  CombinedConditionType,
  ConditionWithSetType,
  EqualValueType,
  GetCombinedConditionsByType,
  RangeType,
  SingleValueType,
  SliderRowsEqualValueType,
  SliderRowsSingleValueType,
  SliderRowsRangeType,
  TimeEqualValueType,
  TimeRangeType,
  TimeSingleValueType,
} from '../SummaryRow.types';
import { getCombinedRangeForConditions } from './getCombinedConditionsValues/getCombinedRangeForConditions';
import { checkAllNumericContradictions } from './checkAllNumericContradictions/checkAllNumericContradictions';

export const checkIfItemsHaveIntersections = <T extends ConditionWithSetType>({
  responseType,
  conditions,
  minValue,
  maxValue,
  sliderRows,
}: GetCombinedConditionsByType) => {
  const groupedCondition = conditions.reduce(
    (acc, condition) => {
      const conditionObject = condition as T;
      const conditionType = conditionObject.type;
      if (!conditionType) return acc;

      if (!acc[conditionType])
        return {
          ...acc,
          [conditionType]: getCombinedRangeForConditions(responseType, conditionType, [
            undefined,
            condition,
          ]),
        };

      const combinedCondition = getCombinedRangeForConditions(responseType, conditionType, [
        acc[conditionType],
        condition,
      ]);

      return { ...acc, [conditionType]: combinedCondition };
    },
    {} as { [k in ConditionType]?: CombinedConditionType },
  );

  switch (responseType) {
    case ItemResponseType.Time:
    case ItemResponseType.Date:
    case ItemResponseType.Slider:
    case ItemResponseType.NumberSelection: {
      if (minValue === undefined || maxValue === undefined) return false;

      const greaterThanValue = (
        groupedCondition[ConditionType.GreaterThan] as SingleValueType | undefined
      )?.value;
      const lessThanValue = (
        groupedCondition[ConditionType.LessThan] as SingleValueType | undefined
      )?.value;
      const equalSetUnion = (groupedCondition[ConditionType.Equal] as EqualValueType | undefined)
        ?.value;
      const notEqualSetUnion = (
        groupedCondition[ConditionType.NotEqual] as EqualValueType | undefined
      )?.value;
      const betweenUnion = (groupedCondition[ConditionType.Between] as RangeType | undefined)
        ?.range;
      const outsideOfUnion = (groupedCondition[ConditionType.OutsideOf] as RangeType | undefined)
        ?.range;

      return checkAllNumericContradictions({
        lessThanValue,
        greaterThanValue,
        equalSetUnion,
        notEqualSetUnion,
        betweenUnion,
        outsideOfUnion,
        minValue,
        maxValue,
      });
    }
    case ItemResponseType.TimeRange: {
      if (minValue === undefined || maxValue === undefined) return false;

      const lessThanCondition = groupedCondition[ConditionType.LessThan] as
        | TimeSingleValueType<number>
        | undefined;
      const lessThanStartTime = lessThanCondition?.startTime?.value;
      const lessThanEndTime = lessThanCondition?.endTime?.value;

      const greaterThanCondition = groupedCondition[ConditionType.GreaterThan] as
        | TimeSingleValueType<number>
        | undefined;
      const greaterThanStartTime = greaterThanCondition?.startTime?.value;
      const greaterThanEndTime = greaterThanCondition?.endTime?.value;

      const equalCondition = groupedCondition[ConditionType.Equal] as
        | TimeEqualValueType<number>
        | undefined;
      const equalSetUnionStartTime = equalCondition?.startTime?.value;
      const equalSetUnionEndTime = equalCondition?.endTime?.value;

      const notEqualCondition = groupedCondition[ConditionType.NotEqual] as
        | TimeEqualValueType<number>
        | undefined;
      const notEqualSetUnionStartTime = notEqualCondition?.startTime?.value;
      const notEqualSetUnionEndTime = notEqualCondition?.endTime?.value;

      const betweenCondition = groupedCondition[ConditionType.Between] as
        | TimeRangeType<number>
        | undefined;
      const betweenUnionStartTime = betweenCondition?.startTime?.range;
      const betweenUnionEndTime = betweenCondition?.endTime?.range;

      const outsideOfCondition = groupedCondition[ConditionType.OutsideOf] as
        | TimeRangeType<number>
        | undefined;
      const outsideOfUnionStartTime = outsideOfCondition?.startTime?.range;
      const outsideOfUnionEndTime = outsideOfCondition?.endTime?.range;

      return (
        checkAllNumericContradictions({
          lessThanValue: lessThanStartTime,
          greaterThanValue: greaterThanStartTime,
          equalSetUnion: equalSetUnionStartTime,
          notEqualSetUnion: notEqualSetUnionStartTime,
          betweenUnion: betweenUnionStartTime,
          outsideOfUnion: outsideOfUnionStartTime,
          minValue,
          maxValue,
        }) ||
        checkAllNumericContradictions({
          lessThanValue: lessThanEndTime,
          greaterThanValue: greaterThanEndTime,
          equalSetUnion: equalSetUnionEndTime,
          notEqualSetUnion: notEqualSetUnionEndTime,
          betweenUnion: betweenUnionEndTime,
          outsideOfUnion: outsideOfUnionEndTime,
          minValue,
          maxValue,
        })
      );
    }
    case ItemResponseType.SliderRows: {
      if (!sliderRows?.length) return false;

      return sliderRows.some(({ minValue, maxValue }, index) => {
        if (minValue === undefined || maxValue === undefined) return false;

        const greaterThanValue = (
          groupedCondition[ConditionType.GreaterThan] as SliderRowsSingleValueType | undefined
        )?.[index]?.value;
        const lessThanValue = (
          groupedCondition[ConditionType.LessThan] as SliderRowsSingleValueType | undefined
        )?.[index]?.value;
        const equalSetUnion = (
          groupedCondition[ConditionType.Equal] as SliderRowsEqualValueType | undefined
        )?.[index]?.value;
        const notEqualSetUnion = (
          groupedCondition[ConditionType.NotEqual] as SliderRowsEqualValueType | undefined
        )?.[index]?.value;
        const betweenUnion = (
          groupedCondition[ConditionType.Between] as SliderRowsRangeType | undefined
        )?.[index]?.range;
        const outsideOfUnion = (
          groupedCondition[ConditionType.OutsideOf] as SliderRowsRangeType | undefined
        )?.[index]?.range;

        return checkAllNumericContradictions({
          lessThanValue,
          greaterThanValue,
          equalSetUnion,
          notEqualSetUnion,
          betweenUnion,
          outsideOfUnion,
          minValue: minValue as number,
          maxValue: maxValue as number,
        });
      });
    }
  }
};

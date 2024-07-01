import { TooltipProps } from '@mui/material';

import i18n from 'i18n';
import { ConditionalLogicMatch, ItemResponseType, ConditionType } from 'shared/consts';
import { getEntityKey } from 'shared/utils';
import { StyledMdPreview } from 'modules/Builder/components/ItemFlowSelectController/StyledMdPreview/StyledMdPreview.styles';
import { getObjectFromList } from 'shared/utils/getObjectFromList';
import { Option } from 'shared/components/FormComponents/SelectController/SelectController.types';
import {
  OptionCondition,
  SingleMultiSelectionPerRowCondition,
  Condition,
  RangeValueCondition,
  SingleValueCondition,
  SliderRowsCondition,
  TimeRangeValueCondition,
  TimeRangeConditionType,
  TimeRangeSingleValueCondition,
} from 'shared/state/Applet';

import { ITEMS_RESPONSE_TYPES_TO_SHOW } from './SummaryRow.const';
import {
  CheckIfSelectionsIntersectionProps,
  GetMatchOptionsProps,
  GetItemsInUsageProps,
  GetItemsOptionsProps,
  GroupedConditionsByRow,
  ConditionWithResponseType,
} from './SummaryRow.types';

const { t } = i18n;

const getObjectFromListByResponseType = (conditions: ConditionWithResponseType[]) =>
  conditions.reduce(
    (acc, condition) => {
      const itemType = condition.responseType;
      if (!itemType) return acc;

      const conditionWithoutResponseType = { ...condition, responseType: undefined };
      if (acc[itemType])
        return {
          ...acc,
          [itemType]: acc[itemType].concat(conditionWithoutResponseType),
        };

      return {
        ...acc,
        [itemType]: [conditionWithoutResponseType],
      };
    },
    {} as Record<ItemResponseType, Condition[]>,
  );

const checkIfSelectionPerRowHasIntersection = <T extends SingleMultiSelectionPerRowCondition>({
  conditions,
  sameOptionValue,
  inverseOptionValue,
}: CheckIfSelectionsIntersectionProps) => {
  const groupedConditionsByRow = conditions.reduce((acc, condition) => {
    const payload = (condition as T).payload;
    const rowIndex = payload?.rowIndex;
    if (rowIndex === undefined || rowIndex === '') return acc;

    if (acc[+rowIndex])
      return {
        ...acc,
        [+rowIndex]: acc[+rowIndex].concat(condition),
      };

    return {
      ...acc,
      [+rowIndex]: [condition],
    };
  }, {} as GroupedConditionsByRow);

  return Object.entries(groupedConditionsByRow).some((entity) =>
    checkIfSelectionsHasIntersection({
      conditions: entity[1],
      sameOptionValue,
      inverseOptionValue,
    }),
  );
};

const checkIfSelectionsHasIntersection = <
  T extends OptionCondition | SingleMultiSelectionPerRowCondition,
>({
  conditions,
  sameOptionValue,
  inverseOptionValue,
}: CheckIfSelectionsIntersectionProps) => {
  const sameOptionValues = conditions.reduce((acc, condition) => {
    const conditionObject = condition as T;
    if (conditionObject.type === sameOptionValue) {
      return acc.add(conditionObject.payload.optionValue);
    }

    return acc;
  }, new Set<T['payload']['optionValue']>());
  const inverseOptionValues = conditions.reduce((acc, condition) => {
    const conditionObject = condition as T;
    if (conditionObject.type === inverseOptionValue) {
      return acc.add(conditionObject.payload.optionValue);
    }

    return acc;
  }, new Set<T['payload']['optionValue']>());
  const intersect = [...sameOptionValues].filter((i) => inverseOptionValues.has(i));
  if (intersect.length > 0) return true;

  return false;
};

type ConditionWithSetType =
  | SingleValueCondition
  | SingleValueCondition<string>
  | RangeValueCondition
  | RangeValueCondition<Date>
  | RangeValueCondition<string>
  | TimeRangeValueCondition
  | SliderRowsCondition
  | SliderRowsCondition<RangeValueCondition>;
// type SetConditionType =
//   | ConditionType.OutsideOf
//   | ConditionType.Between
//   | ConditionType.LessThan
//   | ConditionType.GreaterThan
//   | ConditionType.Equal
//   | ConditionType.NotEqual;
type ResponseTypeForSetType =
  | ItemResponseType.Slider
  | ItemResponseType.Date
  | ItemResponseType.NumberSelection
  | ItemResponseType.Time
  | ItemResponseType.TimeRange
  | ItemResponseType.SliderRows;

type EqualValueType<T = number> = {
  value: Array<T>;
};
type SingleValueType<T = number> = {
  value: T;
};
type RangeType<T = number> = {
  range: [T, T] | [];
};
type TimeEqualValueType<T> = TimeRangeFlagType & {
  [k in TimeRangeConditionType]?: EqualValueType<T>;
};
type TimeSingleValueType<T> = TimeRangeFlagType & {
  [k in TimeRangeConditionType]?: SingleValueType<T>;
};
type TimeRangeType<T> = TimeRangeFlagType & {
  [k in TimeRangeConditionType]?: RangeType<T>;
};
type TimeRangeFlagType = {
  isTimeRange: boolean;
};
type SliderRowsEqualValueType<T = number> = SliderRowsFlagType & {
  [k in number]?: EqualValueType<T>;
};
type SliderRowsSingleValueType<T = number> = SliderRowsFlagType & {
  [k in number]?: SingleValueType<T>;
};
type SliderRowsType<T = number> = SliderRowsFlagType & {
  [k in number]?: RangeType<T>;
};
type SliderRowsFlagType = {
  isSliderRows: boolean;
};
type CombinedConditionType<T = unknown> =
  | RangeType<T>
  | TimeRangeType<T>
  | SliderRowsType<T>
  | SingleValueType<T>
  | TimeSingleValueType<T>
  | SliderRowsSingleValueType<T>;

const getOutsideOfCombinedRange = (
  responseType: ResponseTypeForSetType,
  conditions: [CombinedConditionType | undefined, ConditionWithSetType],
) => {
  switch (responseType) {
    case ItemResponseType.Slider:
    case ItemResponseType.NumberSelection: {
      const nextCondition = conditions[1] as RangeValueCondition;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      if (!conditions[0]) {
        return { range: [nextMinValue, nextMaxValue] };
      }

      const accCondition = conditions[0] as RangeType;
      if (!accCondition.range.length) return accCondition;

      const accMinValue = accCondition.range[0];
      const accMaxValue = accCondition.range[1];
      const leftValue = Math.min(accMinValue, nextMinValue);
      const rightValue = Math.max(accMaxValue, nextMaxValue);

      return { range: [leftValue, rightValue] };
    }
    case ItemResponseType.Date: {
      const nextCondition = conditions[1] as RangeValueCondition<Date>;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      if (!conditions[0]) {
        return { range: [nextMinValue, nextMaxValue] };
      }

      const accCondition = conditions[0] as RangeType<Date>;
      if (!accCondition.range.length) return accCondition;

      const accMinValue = accCondition.range[0];
      const accMaxValue = accCondition.range[1];
      const leftValue = accMinValue < nextMinValue ? accMinValue : nextMinValue;
      const rightValue = accMaxValue > nextMaxValue ? accMaxValue : nextMaxValue;

      return { range: [leftValue, rightValue] };
    }
    case ItemResponseType.Time: {
      const nextCondition = conditions[1] as RangeValueCondition<string>;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      if (!conditions[0]) {
        return { range: [nextMinValue, nextMaxValue] };
      }

      const accCondition = conditions[0] as RangeType<string>;
      if (!accCondition.range.length) return accCondition;

      const accMinValue = accCondition.range?.[0];
      const accMaxValue = accCondition.range[1];
      const leftValue = accMinValue < nextMinValue ? accMinValue : nextMinValue;
      const rightValue = accMaxValue > nextMaxValue ? accMaxValue : nextMaxValue;

      return { range: [leftValue, rightValue] };
    }
    case ItemResponseType.TimeRange: {
      const nextCondition = conditions[1] as TimeRangeValueCondition<string>;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      const payloadType = nextCondition.payload.type;
      if (!conditions[0]) {
        return {
          isTimeRange: true,
          [payloadType]: { range: [nextMinValue, nextMaxValue] },
        };
      }

      const accCondition = conditions[0] as TimeRangeType<string>;
      const timeRange = accCondition[payloadType];

      if (timeRange?.range.length) {
        const accMinValue = timeRange.range[0];
        const accMaxValue = timeRange.range[1];
        const leftValue = accMinValue < nextMinValue ? accMinValue : nextMinValue;
        const rightValue = accMaxValue > nextMaxValue ? accMaxValue : nextMaxValue;

        return {
          ...accCondition,
          [payloadType]: { range: [leftValue, rightValue] },
        };
      }

      return {
        ...accCondition,
        [payloadType]: { range: [nextMinValue, nextMaxValue] },
      };
    }
    case ItemResponseType.SliderRows: {
      const nextCondition = conditions[1] as SliderRowsCondition<RangeValueCondition>;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      const rowIndex = nextCondition.payload.rowIndex;
      if (!conditions[0]) {
        return {
          isSliderRows: true,
          [+rowIndex]: { range: [nextMinValue, nextMaxValue] },
        };
      }

      const accCondition = conditions[0] as SliderRowsType;
      const rowRange = accCondition[+rowIndex];

      if (rowRange?.range.length) {
        const accMinValue = rowRange.range[0];
        const accMaxValue = rowRange.range[1];
        const leftValue = accMinValue < nextMinValue ? accMinValue : nextMinValue;
        const rightValue = accMaxValue > nextMaxValue ? accMaxValue : nextMaxValue;

        return {
          ...accCondition,
          [+rowIndex]: { range: [leftValue, rightValue] },
        };
      }

      return {
        ...accCondition,
        [+rowIndex]: { range: [nextMinValue, nextMaxValue] },
      };
    }
  }
};

const getBetweenCombinedRange = (
  responseType: ResponseTypeForSetType,
  conditions: [CombinedConditionType | undefined, ConditionWithSetType],
) => {
  switch (responseType) {
    case ItemResponseType.Slider:
    case ItemResponseType.NumberSelection: {
      const nextCondition = conditions[1] as RangeValueCondition;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      if (!conditions[0]) {
        return { range: [nextMinValue, nextMaxValue] };
      }

      const accCondition = conditions[0] as RangeType;
      if (accCondition.range.length === 0) return accCondition;

      const accMinValue = accCondition.range[0];
      const accMaxValue = accCondition.range[1];
      const leftValue = Math.max(accMinValue, nextMinValue);
      const rightValue = Math.min(accMaxValue, nextMaxValue);

      if (leftValue >= rightValue) return { range: [] };

      return { range: [leftValue, rightValue] };
    }
    case ItemResponseType.Date: {
      const nextCondition = conditions[1] as RangeValueCondition<Date>;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      if (!conditions[0]) {
        return { range: [nextMinValue, nextMaxValue] };
      }

      const accCondition = conditions[0] as RangeType<Date>;
      if (accCondition.range.length === 0) return accCondition;

      const accMinValue = accCondition.range[0];
      const accMaxValue = accCondition.range[1];
      const leftValue = accMinValue > nextMinValue ? accMinValue : nextMinValue;
      const rightValue = accMaxValue < nextMaxValue ? accMaxValue : nextMaxValue;

      if (leftValue >= rightValue) return { range: [] };

      return { range: [leftValue, rightValue] };
    }
    case ItemResponseType.Time: {
      const nextCondition = conditions[1] as RangeValueCondition<string>;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      if (!conditions[0]) {
        return { range: [nextMinValue, nextMaxValue] };
      }

      const accCondition = conditions[0] as RangeType<string>;
      if (accCondition.range.length === 0) return accCondition;

      const accMinValue = accCondition.range[0];
      const accMaxValue = accCondition.range[1];
      const leftValue = accMinValue > nextMinValue ? accMinValue : nextMinValue;
      const rightValue = accMaxValue < nextMaxValue ? accMaxValue : nextMaxValue;

      if (leftValue >= rightValue) return { range: [] };

      return { range: [leftValue, rightValue] };
    }
    case ItemResponseType.TimeRange: {
      const nextCondition = conditions[1] as TimeRangeValueCondition<string>;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      const payloadType = nextCondition.payload.type;
      if (!conditions[0]) {
        return {
          isTimeRange: true,
          [payloadType]: { range: [nextMinValue, nextMaxValue] },
        };
      }

      const accCondition = conditions[0] as TimeRangeType<string>;
      const timeRange = accCondition[payloadType];

      if (timeRange?.range.length === 0) return accCondition;

      if (timeRange?.range.length) {
        const accMinValue = timeRange.range[0];
        const accMaxValue = timeRange.range[1];
        const leftValue = accMinValue > nextMinValue ? accMinValue : nextMinValue;
        const rightValue = accMaxValue < nextMaxValue ? accMaxValue : nextMaxValue;

        if (leftValue >= rightValue)
          return {
            ...accCondition,
            [payloadType]: { range: [] },
          };

        return {
          ...accCondition,
          [payloadType]: { range: [leftValue, rightValue] },
        };
      }

      if (nextMinValue >= nextMaxValue)
        return {
          ...accCondition,
          isTimeRange: true,
          [payloadType]: { range: [] },
        };

      return {
        ...accCondition,
        isTimeRange: true,
        [payloadType]: { range: [nextMinValue, nextMaxValue] },
      };
    }
    case ItemResponseType.SliderRows: {
      const nextCondition = conditions[1] as SliderRowsCondition<RangeValueCondition>;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      const rowIndex = nextCondition.payload.rowIndex;
      if (!conditions[0]) {
        return {
          isSliderRows: true,
          [+rowIndex]: { range: [nextMinValue, nextMaxValue] },
        };
      }

      const accCondition = conditions[0] as SliderRowsType;
      const rowRange = accCondition[+rowIndex];

      if (rowRange?.range.length === 0) return accCondition;

      if (rowRange?.range.length) {
        const accMinValue = rowRange.range[0];
        const accMaxValue = rowRange.range[1];
        const leftValue = accMinValue > nextMinValue ? accMinValue : nextMinValue;
        const rightValue = accMaxValue < nextMaxValue ? accMaxValue : nextMaxValue;

        if (leftValue >= rightValue)
          return {
            ...accCondition,
            isSliderRows: true,
            [+rowIndex]: { range: [] },
          };

        return {
          ...accCondition,
          isSliderRows: true,
          [+rowIndex]: { range: [leftValue, rightValue] },
        };
      }

      if (nextMinValue >= nextMaxValue)
        return {
          ...accCondition,
          isSliderRows: true,
          [+rowIndex]: { range: [] },
        };

      return {
        ...accCondition,
        isSliderRows: true,
        [+rowIndex]: { range: [nextMinValue, nextMaxValue] },
      };
    }
  }
};

const getLessThanCombinedValue = (
  responseType: ResponseTypeForSetType,
  conditions: [CombinedConditionType | undefined, ConditionWithSetType],
) => {
  switch (responseType) {
    case ItemResponseType.Slider:
    case ItemResponseType.NumberSelection: {
      const nextCondition = conditions[1] as SingleValueCondition;
      const nextValue = nextCondition.payload.value;
      if (!conditions[0]) {
        return { value: nextValue };
      }

      const accCondition = conditions[0] as SingleValueType;
      const accValue = accCondition.value;
      const value = Math.min(accValue, nextValue);

      return { value };
    }
    case ItemResponseType.Date:
    case ItemResponseType.Time: {
      const nextCondition = conditions[1] as SingleValueCondition<string>;
      const nextValue = nextCondition.payload.value;
      if (!conditions[0]) {
        return { value: nextValue };
      }

      const accCondition = conditions[0] as SingleValueType<string>;
      const accValue = accCondition.value;
      const value = accValue < nextValue ? accValue : nextValue;

      return { value };
    }
    case ItemResponseType.TimeRange: {
      const nextCondition = conditions[1] as TimeRangeSingleValueCondition<string>;
      const { value: nextValue, type: payloadType } = nextCondition.payload;
      if (!conditions[0]) {
        return {
          isTimeRange: true,
          [payloadType]: { value: nextValue },
        };
      }

      const accCondition = conditions[0] as TimeSingleValueType<string>;
      const timeRange = accCondition[payloadType];

      if (timeRange) {
        const accValue = timeRange.value;
        const value = accValue < nextValue ? accValue : nextValue;

        return {
          ...accCondition,
          [payloadType]: { value },
        };
      }

      return {
        ...accCondition,
        [payloadType]: { value: nextValue },
      };
    }
    case ItemResponseType.SliderRows: {
      const nextCondition = conditions[1] as SliderRowsCondition;
      const { value: nextValue, rowIndex } = nextCondition.payload;
      if (!conditions[0]) {
        return {
          isSliderRows: true,
          [+rowIndex]: { value: nextValue },
        };
      }

      const accCondition = conditions[0] as SliderRowsSingleValueType;
      const rowRange = accCondition[+rowIndex];

      if (rowRange) {
        const accValue = rowRange.value;
        const value = accValue < nextValue ? accValue : nextValue;

        return {
          ...accCondition,
          [+rowIndex]: { value },
        };
      }

      return {
        ...accCondition,
        [+rowIndex]: { value: nextValue },
      };
    }
  }
};

const getGreaterThanCombinedValue = (
  responseType: ResponseTypeForSetType,
  conditions: [CombinedConditionType | undefined, ConditionWithSetType],
) => {
  switch (responseType) {
    case ItemResponseType.Slider:
    case ItemResponseType.NumberSelection: {
      const nextCondition = conditions[1] as SingleValueCondition;
      const nextValue = nextCondition.payload.value;
      if (!conditions[0]) {
        return { value: nextValue };
      }

      const accCondition = conditions[0] as SingleValueType;
      const accValue = accCondition.value;
      const value = Math.max(accValue, nextValue);

      return { value };
    }
    case ItemResponseType.Date:
    case ItemResponseType.Time: {
      const nextCondition = conditions[1] as SingleValueCondition<string>;
      const nextValue = nextCondition.payload.value;
      if (!conditions[0]) {
        return { value: nextValue };
      }

      const accCondition = conditions[0] as SingleValueType<string>;
      const accValue = accCondition.value;
      const value = accValue > nextValue ? accValue : nextValue;

      return { value };
    }
    case ItemResponseType.TimeRange: {
      const nextCondition = conditions[1] as TimeRangeSingleValueCondition<string>;
      const { value: nextValue, type: payloadType } = nextCondition.payload;
      if (!conditions[0]) {
        return {
          isTimeRange: true,
          [payloadType]: { value: nextValue },
        };
      }

      const accCondition = conditions[0] as TimeSingleValueType<string>;
      const timeRange = accCondition[payloadType];

      if (timeRange) {
        const accValue = timeRange.value;
        const value = accValue > nextValue ? accValue : nextValue;

        return {
          ...accCondition,
          [payloadType]: { value },
        };
      }

      return {
        ...accCondition,
        [payloadType]: { value: nextValue },
      };
    }
    case ItemResponseType.SliderRows: {
      const nextCondition = conditions[1] as SliderRowsCondition;
      const { value: nextValue, rowIndex } = nextCondition.payload;
      if (!conditions[0]) {
        return {
          isSliderRows: true,
          [+rowIndex]: { value: nextValue },
        };
      }

      const accCondition = conditions[0] as SliderRowsSingleValueType;
      const rowRange = accCondition[+rowIndex];

      if (rowRange) {
        const accValue = rowRange.value;
        const value = accValue > nextValue ? accValue : nextValue;

        return {
          ...accCondition,
          [+rowIndex]: { value },
        };
      }

      return {
        ...accCondition,
        [+rowIndex]: { value: nextValue },
      };
    }
  }
};

const getCombinedValueSet = (
  responseType: ResponseTypeForSetType,
  conditions: [CombinedConditionType | undefined, ConditionWithSetType],
) => {
  switch (responseType) {
    case ItemResponseType.Slider:
    case ItemResponseType.NumberSelection: {
      const nextCondition = conditions[1] as SingleValueCondition;
      const nextValue = nextCondition.payload.value;
      if (!conditions[0]) {
        return { value: [nextValue] };
      }

      const accCondition = conditions[0] as EqualValueType;
      const accValue = accCondition.value;

      return { value: accValue.concat(nextValue) };
    }
    case ItemResponseType.Date:
    case ItemResponseType.Time: {
      const nextCondition = conditions[1] as SingleValueCondition<string>;
      const nextValue = nextCondition.payload.value;
      if (!conditions[0]) {
        return { value: [nextValue] };
      }

      const accCondition = conditions[0] as SingleValueType<string>;
      const accValue = accCondition.value;

      return { value: accValue.concat(nextValue) };
    }
    case ItemResponseType.TimeRange: {
      const nextCondition = conditions[1] as TimeRangeSingleValueCondition<string>;
      const { value: nextValue, type: payloadType } = nextCondition.payload;
      if (!conditions[0]) {
        return {
          isTimeRange: true,
          [payloadType]: { value: [nextValue] },
        };
      }

      const accCondition = conditions[0] as TimeEqualValueType<string>;
      const timeRange = accCondition[payloadType];

      if (timeRange) {
        const accValue = timeRange.value;

        return {
          ...accCondition,
          [payloadType]: { value: accValue.concat(nextValue) },
        };
      }

      return {
        ...accCondition,
        [payloadType]: { value: [nextValue] },
      };
    }
    case ItemResponseType.SliderRows: {
      const nextCondition = conditions[1] as SliderRowsCondition;
      const { value: nextValue, rowIndex } = nextCondition.payload;
      if (!conditions[0]) {
        return {
          isSliderRows: true,
          [+rowIndex]: { value: [nextValue] },
        };
      }

      const accCondition = conditions[0] as SliderRowsEqualValueType;
      const rowRange = accCondition[+rowIndex];

      if (rowRange) {
        const accValue = rowRange.value;

        return {
          ...accCondition,
          [+rowIndex]: { value: accValue.concat(nextValue) },
        };
      }

      return {
        ...accCondition,
        [+rowIndex]: { value: [nextValue] },
      };
    }
  }
};

const getCombinedRangeForCondition = (
  responseType: ResponseTypeForSetType,
  type: ConditionType,
  conditions: [CombinedConditionType | undefined, ConditionWithSetType],
) => {
  switch (type) {
    case ConditionType.OutsideOf: {
      return getOutsideOfCombinedRange(responseType, conditions);
    }
    case ConditionType.Between: {
      return getBetweenCombinedRange(responseType, conditions);
    }
    case ConditionType.LessThan: {
      return getLessThanCombinedValue(responseType, conditions);
    }
    case ConditionType.GreaterThan: {
      return getGreaterThanCombinedValue(responseType, conditions);
    }
    case ConditionType.Equal: {
      return getCombinedValueSet(responseType, conditions);
    }
    case ConditionType.NotEqual: {
      return getCombinedValueSet(responseType, conditions);
    }
  }
};

export const getCombinedConditionsByType = <T extends ConditionWithSetType>(
  responseType: ResponseTypeForSetType,
  conditions: ConditionWithSetType[],
) => {
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

  // return groupedCondition;
  switch (responseType) {
    case ItemResponseType.Slider: {
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
      });

      // const intersect = new Set([...outsideOfUnion].concat(betweenUnion).concat(lessThanValue).concat(greaterThanValue).concat(equalSetUnion))
      // + notEqualSetUnion logic
      // NumberSelection: between: [1, 10] => [2,3,4,5,6,7,8,9]
      // NumberSelection: between: [3, 10] => [0,1,2,11,12]

      // Time/TimeRange: between ["11:10", "23:14"] => [00:00] ["11:11", .. "11:59", "12:00", ..."23:13"] [23:59]

      // Date: between ["2020-10-01", "2023-12-17"] => ["2020-10-01", ..., "2020-11-01", ..., ""]

      const hasNoOverlappesInOutside = outsideOfUnion?.length === 0;
      const hasNoOverlappesInBetween = betweenUnion?.length === 0;
      if (hasNoOverlappesInOutside || hasNoOverlappesInBetween) return true;

      // let unionOutsideAndBetween = {range1: [], range2: []};
      if (outsideOfUnion) {
        const outsideLeft = outsideOfUnion[0];
        const outsideRight = outsideOfUnion[1];

        if (betweenUnion) {
          const betweenLeft = betweenUnion[0];
          const betweenRight = betweenUnion[1];

          if (outsideLeft <= betweenLeft && outsideRight >= betweenRight) return true;

          let l1LeftPartLeftBound;
          let l1LeftPartRightBound;
          let l1RightPartLeftBound;
          let l1RightPartRightBound;
          if (outsideLeft > betweenLeft) {
            l1LeftPartLeftBound = betweenLeft;
            l1LeftPartRightBound = outsideLeft;
          }
          if (outsideRight < betweenRight) {
            l1RightPartLeftBound = outsideRight;
            l1RightPartRightBound = betweenRight;
          }

          if (lessThanValue) {
            if (
              (l1LeftPartLeftBound && l1LeftPartLeftBound >= lessThanValue) ||
              (l1RightPartLeftBound && l1RightPartLeftBound >= lessThanValue)
            )
              return true;

            let l2LeftPartLeftBound;
            let l2LeftPartRightBound;
            let l2RightPartLeftBound;
            let l2RightPartRightBound;
            // Date: "2020-08-10" < , > "2020-10-18",
            // Time: "11:07" "23:45", TimeRange,

            if (
              l1RightPartRightBound &&
              l1RightPartLeftBound &&
              l1RightPartLeftBound < lessThanValue
            ) {
              l2RightPartLeftBound = l1RightPartLeftBound;
              l2RightPartRightBound =
                lessThanValue < l1RightPartRightBound ? lessThanValue : l1RightPartRightBound;
            }
            if (
              l1LeftPartRightBound &&
              l1LeftPartLeftBound &&
              l1LeftPartLeftBound < lessThanValue
            ) {
              l2LeftPartLeftBound = l1LeftPartLeftBound;
              l2LeftPartRightBound =
                lessThanValue < l1LeftPartRightBound ? lessThanValue : l1LeftPartRightBound;
            }

            console.log({
              l2RightPartLeftBound,
              l2RightPartRightBound,
              l2LeftPartLeftBound,
              l2LeftPartRightBound,
            });

            // if (greaterThanValue) {

            // if (equalSetUnion) {

            // if (notEqualSetUnion) {}

            // }

            // }
          }
        } else {
          //
          //   if (lessThanValue) { ...}
        }
      } else {
        // if (betweenUnion) { ... }
      }

      // const hasContradictions = hasNoOverlappesInOutside || hasNoOverlappesInBetween || (
      //   outsideOfUnion
      // )

      return false;
    }
    case ItemResponseType.Date: {
      return false;
    }
    case ItemResponseType.NumberSelection: {
      return false;
    }
    case ItemResponseType.Time: {
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

const checkIfHasContradiction = (
  conditionsByResponseType: ReturnType<typeof getObjectFromListByResponseType>,
) => {
  const groupedItemsByType = Object.entries(conditionsByResponseType);
  const hasContradiction = groupedItemsByType.some((entity) => {
    const type = entity[0];
    const groupedConditions = entity[1];

    switch (type) {
      case ItemResponseType.Slider:
      case ItemResponseType.Date:
      case ItemResponseType.NumberSelection:
      case ItemResponseType.Time:
      case ItemResponseType.TimeRange: //payload.type
      case ItemResponseType.SliderRows: {
        // ConditionType.GreaterThan
        // ConditionType.LessThan
        // ConditionType.Equal
        // ConditionType.NotEqual
        // ConditionType.Between
        // ConditionType.OutsideOf
        //
        // return getCombinedConditionsByType(type, groupedConditions as ConditionWithSetType[]);

        return false;
      }
      case ItemResponseType.SingleSelection:
        return checkIfSelectionsHasIntersection({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.EqualToOption,
          inverseOptionValue: ConditionType.NotEqualToOption,
        });

      case ItemResponseType.SingleSelectionPerRow:
        return checkIfSelectionPerRowHasIntersection({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.EqualToOption,
          inverseOptionValue: ConditionType.NotEqualToOption,
        });
      case ItemResponseType.MultipleSelection:
        return checkIfSelectionsHasIntersection({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.IncludesOption,
          inverseOptionValue: ConditionType.NotIncludesOption,
        });
      case ItemResponseType.MultipleSelectionPerRow:
        return checkIfSelectionPerRowHasIntersection({
          conditions: groupedConditions,
          sameOptionValue: ConditionType.IncludesOption,
          inverseOptionValue: ConditionType.NotIncludesOption,
        });
      default:
        return false;
    }
  });

  return hasContradiction;
};

export const getMatchOptions = ({ items, conditions = [] }: GetMatchOptionsProps): Option[] => {
  const itemsObject = getObjectFromList(items);
  const conditionItems = conditions.reduce((acc, condition) => {
    const item = itemsObject[condition.itemName];
    if (!item) return acc;

    return acc.concat({
      responseType: item.responseType,
      ...condition,
    });
  }, [] as ConditionWithResponseType[]);
  const conditionsByResponseType = getObjectFromListByResponseType(conditionItems);
  const hasContradiction = checkIfHasContradiction(conditionsByResponseType);

  return [
    {
      value: ConditionalLogicMatch.Any,
      labelKey: t('any'),
    },
    {
      value: ConditionalLogicMatch.All,
      labelKey: t('all'),
      disabled: hasContradiction,
      tooltip: hasContradiction
        ? t('conditionalLogicValidation.impossibleToFulfillTheConditionsSimultaneously')
        : undefined,
    },
  ];
};

export const getItemsOptions = ({ items, itemsInUsage, conditions }: GetItemsOptionsProps) => {
  const itemsObject = getObjectFromList(items, undefined, true);
  const conditionItemsInUsageSet = new Set(conditions.map((condition) => condition.itemName));
  const maxUsedItemIndex = [...conditionItemsInUsageSet].reduce((maxIndex, itemKey) => {
    const item = itemsObject[itemKey];
    const itemIndex = item?.index ?? -1;
    if (!item || (typeof itemIndex === 'number' && itemIndex <= maxIndex)) return maxIndex;

    return itemIndex;
  }, -1);

  return items?.reduce((optionList: { value: string; labelKey: string }[], item, index) => {
    if (!item.responseType || !ITEMS_RESPONSE_TYPES_TO_SHOW.includes(item.responseType))
      return optionList;

    const value = getEntityKey(item);
    // 1# rule: summaryItemIsTheSameAsRuleItem
    if (conditionItemsInUsageSet.has(value)) {
      return [
        ...optionList,
        {
          value,
          labelKey: item.name,
          disabled: true,
          tooltip: t('conditionalLogicValidation.summaryItemIsTheSameAsRuleItem'),
          tooltipPlacement: 'right' as TooltipProps['placement'],
        },
      ];
    }
    // 2# rule: summaryItemIsBeforeRuleItemInTheList
    if (index <= maxUsedItemIndex) {
      return [
        ...optionList,
        {
          value,
          labelKey: item.name,
          disabled: true,
          tooltip: t('conditionalLogicValidation.summaryItemIsBeforeRuleItemInTheList'),
          tooltipPlacement: 'right' as TooltipProps['placement'],
        },
      ];
    }

    // #last rule: usage in other conditionals
    const disabled = itemsInUsage.has(value);
    const showTooltip = disabled || item.question;
    const tooltipPlacement: TooltipProps['placement'] | undefined = showTooltip
      ? 'right'
      : undefined;
    const tooltip = disabled ? (
      t('conditionalLogicValidation.usageInSummaryRow')
    ) : (
      <StyledMdPreview modelValue={item.question ?? ''} />
    );

    return [...optionList, { value, labelKey: item.name, disabled, tooltip, tooltipPlacement }];
  }, []);
};

export const getItemsInUsage = ({ conditionalLogic, itemKey }: GetItemsInUsageProps) =>
  (conditionalLogic ?? []).reduce((acc, conditional) => {
    if (!conditional.itemKey || conditional.itemKey === itemKey) return acc;

    return acc.add(conditional.itemKey);
  }, new Set());

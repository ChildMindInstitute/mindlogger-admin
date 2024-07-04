import { TooltipProps } from '@mui/material';

import i18n from 'i18n';
import { ConditionalLogicMatch, ConditionType, ItemResponseType } from 'shared/consts';
import { getEntityKey } from 'shared/utils';
import { StyledMdPreview } from 'modules/Builder/components/ItemFlowSelectController/StyledMdPreview/StyledMdPreview.styles';
import { getObjectFromList } from 'shared/utils/getObjectFromList';
import { Option } from 'shared/components/FormComponents/SelectController/SelectController.types';
import {
  BaseCondition,
  Condition,
  NumberItemResponseValues,
  OptionCondition,
  RangeValueCondition,
  RangeValueConditionDate,
  ResponseValues,
  SingleMultiSelectionPerRowCondition,
  SingleValueCondition,
  SliderItemResponseValues,
  SliderRowsCondition,
  TimeRangeConditionType,
  TimeRangeValueCondition,
} from 'shared/state/Applet';

import { ITEMS_RESPONSE_TYPES_TO_SHOW } from './SummaryRow.const';
import {
  CheckIfSelectionsIntersectionProps,
  ConditionWithResponseType,
  GetItemsInUsageProps,
  GetItemsOptionsProps,
  GetMatchOptionsProps,
  GroupedConditionsByRow,
} from './SummaryRow.types';

const { t } = i18n;

// const getObjectFromListByResponseType = (conditions: ConditionWithResponseType[]) =>
//   conditions.reduce(
//     (acc, condition) => {
//       const itemType = condition.responseType;
//       if (!itemType) return acc;
//
//       const conditionWithoutResponseType = { ...condition, responseType: undefined };
//       if (acc[itemType])
//         return {
//           ...acc,
//           [itemType]: acc[itemType].concat(conditionWithoutResponseType),
//         };
//
//       return {
//         ...acc,
//         [itemType]: [conditionWithoutResponseType],
//       };
//     },
//     {} as Record<ItemResponseType, Condition[]>,
//   );

const getObjectFromListByItemId = (conditions: ConditionWithResponseType[]) =>
  conditions.reduce(
    (acc, condition) => {
      const { responseType: itemType, ...rest } = condition;
      const itemId = condition.itemName;
      if (!itemId || !itemType) return acc;

      if (acc[itemId]) {
        acc[itemId].conditions.push(rest);
      } else {
        acc[itemId] = {
          itemType,
          conditions: [rest],
        };
      }

      return acc;
    },
    {} as Record<
      string,
      {
        itemType: ItemResponseType;
        conditions: (Condition & { responseValues: ResponseValues })[];
      }
    >,
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

type SingleValueConditionString = BaseCondition & {
  payload: {
    value: string;
  };
};

type RangeValueConditionString = BaseCondition & {
  payload: {
    minValue: string;
    maxValue: string;
  };
};

type TimeRangeValueConditionString = BaseCondition & {
  payload: {
    minValue: string;
    maxValue: string;
    type: TimeRangeConditionType;
  };
};

type TimeRangeSingleValueConditionString = BaseCondition & {
  payload: {
    value: string;
    type: TimeRangeConditionType;
  };
};

type ConditionWithSetType =
  | SingleValueCondition
  | SingleValueConditionString
  | RangeValueCondition
  | RangeValueConditionDate
  | RangeValueConditionString
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

type EqualValueTypeNumber = {
  value: Array<number>;
};

type EqualValueTypeString = {
  value: Array<string>;
};

type SingleValueTypeNumber = {
  value: number;
};

type SingleValueTypeString = {
  value: string;
};

type RangeTypeNumber = {
  range: [number, number] | [];
};

type RangeTypeString = {
  range: [string, string] | [];
};

type RangeTypeDate = {
  range: [Date, Date] | [];
};

type TimeRangeFlagType = {
  isTimeRange: boolean;
};

type TimeEqualValueType = TimeRangeFlagType & {
  [k in TimeRangeConditionType]?: EqualValueTypeString;
};

type TimeSingleValueType = TimeRangeFlagType & {
  [k in TimeRangeConditionType]?: SingleValueTypeString;
};

type TimeRangeType = TimeRangeFlagType & {
  [k in TimeRangeConditionType]?: RangeTypeString;
};

type SliderRowsEqualValueType = SliderRowsFlagType & {
  [k in number]?: EqualValueTypeNumber;
};

type SliderRowsSingleValueType = SliderRowsFlagType & {
  [k in number]?: SingleValueTypeNumber;
};

type SliderRowsType = SliderRowsFlagType & {
  [k in number]?: RangeTypeNumber;
};

type SliderRowsFlagType = {
  isSliderRows: boolean;
};

type CombinedConditionType =
  | RangeTypeNumber
  | RangeTypeDate
  | RangeTypeString
  | TimeRangeType
  | SliderRowsType
  | SingleValueTypeNumber
  | SingleValueTypeString
  | TimeSingleValueType
  | SliderRowsSingleValueType
  | EqualValueTypeNumber
  | EqualValueTypeString;

// type CombinedConditionType<T = unknown> =
//   | RangeType<T>
//   | TimeRangeType<T>
//   | SliderRowsType<T>
//   | SingleValueType<T>
//   | TimeSingleValueType<T>
//   | SliderRowsSingleValueType<T>;

// type EqualValueType<T = number> = {
//   value: Array<T>;
// };
// type SingleValueType<T = number> = {
//   value: T;
// };
// type RangeType<T = number> = {
//   range: [T, T] | [];
// };
// type TimeRangeFlagType = {
//   isTimeRange: boolean;
// };
// type TimeEqualValueType<T> = TimeRangeFlagType & {
//   [k in TimeRangeConditionType]?: EqualValueType<T>;
// };
// type TimeSingleValueType<T> = TimeRangeFlagType & {
//   [k in TimeRangeConditionType]?: SingleValueType<T>;
// };
// type TimeRangeType<T> = TimeRangeFlagType & {
//   [k in TimeRangeConditionType]?: RangeType<T>;
// };
// type SliderRowsEqualValueType<T = number> = SliderRowsFlagType & {
//   [k in number]?: EqualValueType<T>;
// };
// type SliderRowsSingleValueType<T = number> = SliderRowsFlagType & {
//   [k in number]?: SingleValueType<T>;
// };
// type SliderRowsType<T = number> = SliderRowsFlagType & {
//   [k in number]?: RangeType<T>;
// };
// type SliderRowsFlagType = {
//   isSliderRows: boolean;
// };
// type CombinedConditionType<T = unknown> =
//   | RangeType<T>
//   | TimeRangeType<T>
//   | SliderRowsType<T>
//   | SingleValueType<T>
//   | TimeSingleValueType<T>
//   | SliderRowsSingleValueType<T>;

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

      const accCondition = conditions[0] as RangeTypeNumber;
      if (!accCondition.range.length) return accCondition;

      const accMinValue = accCondition.range[0];
      const accMaxValue = accCondition.range[1];
      const leftValue = Math.min(accMinValue, nextMinValue);
      const rightValue = Math.max(accMaxValue, nextMaxValue);

      return { range: [leftValue, rightValue] };
    }
    case ItemResponseType.Date: {
      const nextCondition = conditions[1] as RangeValueConditionDate;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      if (!conditions[0]) {
        return { range: [nextMinValue, nextMaxValue] };
      }

      // const accCondition = conditions[0] as RangeType<Date>;
      const accCondition = conditions[0] as RangeTypeDate;
      if (!accCondition.range.length) return accCondition;

      const accMinValue = accCondition.range[0];
      const accMaxValue = accCondition.range[1];
      const leftValue = accMinValue < nextMinValue ? accMinValue : nextMinValue;
      const rightValue = accMaxValue > nextMaxValue ? accMaxValue : nextMaxValue;

      return { range: [leftValue, rightValue] };
    }
    case ItemResponseType.Time: {
      const nextCondition = conditions[1] as RangeValueConditionString;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      if (!conditions[0]) {
        return { range: [nextMinValue, nextMaxValue] };
      }

      // const accCondition = conditions[0] as RangeType<string>;
      const accCondition = conditions[0] as RangeTypeString;
      if (!accCondition.range.length) return accCondition;

      const accMinValue = accCondition.range?.[0];
      const accMaxValue = accCondition.range[1];
      const leftValue = accMinValue < nextMinValue ? accMinValue : nextMinValue;
      const rightValue = accMaxValue > nextMaxValue ? accMaxValue : nextMaxValue;

      return { range: [leftValue, rightValue] };
    }
    case ItemResponseType.TimeRange: {
      const nextCondition = conditions[1] as TimeRangeValueConditionString;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      const payloadType = nextCondition.payload.type;
      if (!conditions[0]) {
        return {
          isTimeRange: true,
          [payloadType]: { range: [nextMinValue, nextMaxValue] },
        };
      }

      // const accCondition = conditions[0] as TimeRangeType<string>;
      const accCondition = conditions[0] as TimeRangeType;
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

      // const accCondition = conditions[0] as RangeType;
      const accCondition = conditions[0] as RangeTypeNumber;
      if (accCondition.range.length === 0) return accCondition;

      const accMinValue = accCondition.range[0];
      const accMaxValue = accCondition.range[1];
      const leftValue = Math.max(accMinValue, nextMinValue);
      const rightValue = Math.min(accMaxValue, nextMaxValue);

      if (leftValue >= rightValue) return { range: [] };

      return { range: [leftValue, rightValue] };
    }
    case ItemResponseType.Date: {
      const nextCondition = conditions[1] as RangeValueConditionDate;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      if (!conditions[0]) {
        return { range: [nextMinValue, nextMaxValue] };
      }

      // const accCondition = conditions[0] as RangeType<Date>;
      const accCondition = conditions[0] as RangeTypeDate;
      if (accCondition.range.length === 0) return accCondition;

      const accMinValue = accCondition.range[0];
      const accMaxValue = accCondition.range[1];
      const leftValue = accMinValue > nextMinValue ? accMinValue : nextMinValue;
      const rightValue = accMaxValue < nextMaxValue ? accMaxValue : nextMaxValue;

      if (leftValue >= rightValue) return { range: [] };

      return { range: [leftValue, rightValue] };
    }
    case ItemResponseType.Time: {
      const nextCondition = conditions[1] as RangeValueConditionString;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      if (!conditions[0]) {
        return { range: [nextMinValue, nextMaxValue] };
      }

      // const accCondition = conditions[0] as RangeType<string>;
      const accCondition = conditions[0] as RangeTypeString;
      if (accCondition.range.length === 0) return accCondition;

      const accMinValue = accCondition.range[0];
      const accMaxValue = accCondition.range[1];
      const leftValue = accMinValue > nextMinValue ? accMinValue : nextMinValue;
      const rightValue = accMaxValue < nextMaxValue ? accMaxValue : nextMaxValue;

      if (leftValue >= rightValue) return { range: [] };

      return { range: [leftValue, rightValue] };
    }
    case ItemResponseType.TimeRange: {
      const nextCondition = conditions[1] as TimeRangeValueConditionString;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      const payloadType = nextCondition.payload.type;
      if (!conditions[0]) {
        return {
          isTimeRange: true,
          [payloadType]: { range: [nextMinValue, nextMaxValue] },
        };
      }

      // const accCondition = conditions[0] as TimeRangeType<string>;
      const accCondition = conditions[0] as TimeRangeType;
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

      const accCondition = conditions[0] as SingleValueTypeNumber;
      const accValue = accCondition.value;
      const value = Math.min(accValue, nextValue);

      return { value };
    }
    case ItemResponseType.Date:
    case ItemResponseType.Time: {
      const nextCondition = conditions[1] as SingleValueConditionString;
      const nextValue = nextCondition.payload.value;
      if (!conditions[0]) {
        return { value: nextValue };
      }

      // const accCondition = conditions[0] as SingleValueType<string>;
      const accCondition = conditions[0] as SingleValueTypeString;
      const accValue = accCondition.value;
      const value = accValue < nextValue ? accValue : nextValue;

      return { value };
    }
    case ItemResponseType.TimeRange: {
      const nextCondition = conditions[1] as TimeRangeSingleValueConditionString;
      const { value: nextValue, type: payloadType } = nextCondition.payload;
      if (!conditions[0]) {
        return {
          isTimeRange: true,
          [payloadType]: { value: nextValue },
        };
      }

      const accCondition = conditions[0] as TimeSingleValueType;
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

      const accCondition = conditions[0] as SingleValueTypeNumber;
      const accValue = accCondition.value;
      const value = Math.max(accValue, nextValue);

      return { value };
    }
    case ItemResponseType.Date:
    case ItemResponseType.Time: {
      const nextCondition = conditions[1] as SingleValueConditionString;
      const nextValue = nextCondition.payload.value;
      if (!conditions[0]) {
        return { value: nextValue };
      }

      const accCondition = conditions[0] as SingleValueTypeString;
      const accValue = accCondition.value;
      const value = accValue > nextValue ? accValue : nextValue;

      return { value };
    }
    case ItemResponseType.TimeRange: {
      const nextCondition = conditions[1] as TimeRangeSingleValueConditionString;
      const { value: nextValue, type: payloadType } = nextCondition.payload;
      if (!conditions[0]) {
        return {
          isTimeRange: true,
          [payloadType]: { value: nextValue },
        };
      }

      const accCondition = conditions[0] as TimeSingleValueType;
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

      const accCondition = conditions[0] as EqualValueTypeNumber;
      const accValue = accCondition.value;

      return { value: accValue.concat(nextValue) };
    }
    case ItemResponseType.Date:
    case ItemResponseType.Time: {
      const nextCondition = conditions[1] as SingleValueConditionString;
      const nextValue = nextCondition.payload.value;
      if (!conditions[0]) {
        return { value: [nextValue] };
      }

      const accCondition = conditions[0] as SingleValueTypeString;
      const accValue = accCondition.value;

      return { value: accValue.concat(nextValue) };
    }
    case ItemResponseType.TimeRange: {
      const nextCondition = conditions[1] as TimeRangeSingleValueConditionString;
      const { value: nextValue, type: payloadType } = nextCondition.payload;
      if (!conditions[0]) {
        return {
          isTimeRange: true,
          [payloadType]: { value: [nextValue] },
        };
      }

      const accCondition = conditions[0] as TimeEqualValueType;
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
    case ItemResponseType.Slider:
    case ItemResponseType.NumberSelection: {
      const outsideOfUnion = (
        groupedCondition[ConditionType.OutsideOf] as RangeTypeNumber | undefined
      )?.range;
      const betweenUnion = (groupedCondition[ConditionType.Between] as RangeTypeNumber | undefined)
        ?.range;
      const lessThanValue = (
        groupedCondition[ConditionType.LessThan] as SingleValueTypeNumber | undefined
      )?.value;
      const greaterThanValue = (
        groupedCondition[ConditionType.GreaterThan] as SingleValueTypeNumber | undefined
      )?.value;
      const equalSetUnion = (
        groupedCondition[ConditionType.Equal] as EqualValueTypeNumber | undefined
      )?.value;
      const notEqualSetUnion = (
        groupedCondition[ConditionType.NotEqual] as EqualValueTypeNumber | undefined
      )?.value;

      console.log({
        outsideOfUnion,
        betweenUnion,
        lessThanValue,
        greaterThanValue,
        equalSetUnion,
        notEqualSetUnion,
      });

      type Range = {
        min: number;
        max: number;
      };

      const checkGreaterLessOutside = ({
        compareValue,
        outsideRange,
        validRange,
        comparisonType,
      }: {
        compareValue: number;
        outsideRange: Range;
        validRange: Range;
        comparisonType: ConditionType.LessThan | ConditionType.GreaterThan;
      }): boolean => {
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

          const overlapsWithOutsideRange1 =
            lessThanStart <= outsideEnd1 && lessThanEnd >= outsideStart1;
          const overlapsWithOutsideRange2 =
            lessThanStart <= outsideEnd2 && lessThanEnd >= outsideStart2;

          return !(overlapsWithOutsideRange1 || overlapsWithOutsideRange2);
        }

        return false;
      };

      const checkGreaterLessNotEqual = ({
        compareValue,
        notEqualArray,
        validRange,
        comparisonType,
      }: {
        compareValue: number;
        notEqualArray: number[];
        validRange: Range;
        comparisonType: ConditionType.LessThan | ConditionType.GreaterThan;
      }): boolean => {
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
        // Check "equalTo" and "inNotEqualTo" contradiction
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

      const checkNotEqualBetween = ({
        betweenUnion,
        notEqualSetUnion,
      }: {
        betweenUnion: number[];
        notEqualSetUnion: number[];
      }) => {
        const [min, max] = betweenUnion;

        for (let value = min + 1; value < max; value++) {
          if (!notEqualSetUnion.includes(value)) {
            return false;
          }
        }

        return true;
      };

      if (
        notEqualSetUnion !== undefined &&
        betweenUnion?.length === 2 &&
        checkNotEqualBetween({ betweenUnion, notEqualSetUnion })
      ) {
        // Check "inNotEqualTo" and "betweenValues" contradiction
        return true;
      }

      const checkNotEqualOutside = ({
        outsideOfUnion,
        notEqualSetUnion,
        minValue,
        maxValue,
      }: {
        outsideOfUnion: number[];
        notEqualSetUnion: number[];
        minValue: number;
        maxValue: number;
      }) => {
        const [minRange, maxRange] = outsideOfUnion;
        const notEqualSet = new Set(notEqualSetUnion);

        return Array.from({ length: maxValue - minValue + 1 }, (_, i) => minValue + i)
          .filter((value) => value < minRange || value > maxRange)
          .every((value) => notEqualSet.has(value));
      };

      if (
        notEqualSetUnion !== undefined &&
        outsideOfUnion?.length === 2 &&
        checkNotEqualOutside({ outsideOfUnion, notEqualSetUnion, minValue, maxValue })
      ) {
        // Check "inNotEqualTo" and "outsideValues" contradiction
        return true;
      }

      const checkContradiction = ({
        betweenUnion,
        outsideOfUnion,
      }: {
        betweenUnion: number[];
        outsideOfUnion: number[];
      }) => {
        const [minBetween, maxBetween] = betweenUnion;
        const [minOutside, maxOutside] = outsideOfUnion;

        if (minBetween >= maxOutside) return false;
        if (minOutside - minBetween > 1) return false;
        if (maxBetween - maxOutside > 1) return false;

        return true;
      };
      if (
        betweenUnion?.length === 2 &&
        outsideOfUnion?.length === 2 &&
        checkContradiction({ betweenUnion, outsideOfUnion })
      ) {
        // Check "between" and "outsideValues" contradiction
        return true;
      }

      return false;
    }
    case ItemResponseType.Date: {
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
  // conditionsByResponseType: ReturnType<typeof getObjectFromListByResponseType>,
  conditionsByItemId: ReturnType<typeof getObjectFromListByItemId>,
) => {
  // const groupedItemsByType = Object.entries(conditionsByResponseType);
  // const hasContradiction = groupedItemsByType.some((entity) => {
  // console.log('conditions by item id', conditionsByItemId);
  const groupedItemsByItemId = Object.entries(conditionsByItemId);
  // console.log('groupedItemsByItemId', groupedItemsByItemId);

  return groupedItemsByItemId.some((entity) => {
    // const type = entity[0];
    // const groupedConditions = entity[1];
    const type = entity[1].itemType;
    const groupedConditions = entity[1].conditions;

    switch (type) {
      case ItemResponseType.Slider:
      case ItemResponseType.NumberSelection: {
        // ConditionType.GreaterThan
        // ConditionType.LessThan
        // ConditionType.Equal
        // ConditionType.NotEqual
        // ConditionType.Between
        // ConditionType.OutsideOf
        //
        const responseValues = groupedConditions[0].responseValues as
          | SliderItemResponseValues
          | NumberItemResponseValues;

        return getCombinedConditionsByType({
          responseType: type,
          conditions: groupedConditions as ConditionWithSetType[],
          minValue: responseValues.minValue as number,
          maxValue: responseValues.maxValue as number,
        });
        // return getCombinedConditionsByType({responseType: type, conditions: groupedConditions as ConditionWithSetType[], minValue: groupedConditions[0].});
        // return false;
      }
      case ItemResponseType.Date:
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
};

export const getMatchOptions = ({ items, conditions = [] }: GetMatchOptionsProps): Option[] => {
  const itemsObject = getObjectFromList(items);
  // console.log('items object', itemsObject);
  const conditionItems = conditions.reduce((acc, condition) => {
    const item = itemsObject[condition.itemName];
    if (!item) return acc;

    return acc.concat({
      responseValues: item.responseValues,
      responseType: item.responseType,
      ...condition,
    });
  }, [] as ConditionWithResponseType[]);
  // const conditionsByResponseType = getObjectFromListByResponseType(conditionItems);
  // const hasContradiction = checkIfHasContradiction(conditionsByResponseType);
  const conditionsByItemId = getObjectFromListByItemId(conditionItems);
  const hasContradiction = checkIfHasContradiction(conditionsByItemId);

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

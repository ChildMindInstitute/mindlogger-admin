import { ItemResponseType } from 'shared/consts';
import {
  DateSingleValueCondition,
  TimeSingleValueCondition,
  SingleValueCondition,
  SliderRowsCondition,
  TimeRangeSingleValueCondition,
} from 'shared/state/Applet';

import {
  CombinedConditionType,
  ConditionWithSetType,
  ResponseTypeForSetType,
  SingleValueType,
  SliderRowsSingleValueType,
  TimeSingleValueType,
} from '../../SummaryRow.types';
import { convertToMinutes } from '../convertToMinutes';
import { convertDateToNumber } from '../convertDateToNumber';

export const getLessThanCombinedValue = (
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
    case ItemResponseType.Date: {
      const nextCondition = conditions[1] as DateSingleValueCondition<Date>;
      const nextValue = nextCondition.payload.date;
      if (!conditions[0]) {
        return { value: convertDateToNumber(nextValue) };
      }

      const accCondition = conditions[0] as SingleValueType<Date>;
      const accValue = accCondition.value;
      const value = accValue < nextValue ? accValue : nextValue;

      return { value: convertDateToNumber(value) };
    }
    case ItemResponseType.Time: {
      const nextCondition = conditions[1] as TimeSingleValueCondition;
      const nextValue = nextCondition.payload.time;
      if (!conditions[0]) {
        return { value: convertToMinutes(nextValue) };
      }

      const accCondition = conditions[0] as SingleValueType<string>;
      const accValue = accCondition.value;
      const value = accValue < nextValue ? accValue : nextValue;

      return { value: convertToMinutes(value) };
    }
    case ItemResponseType.TimeRange: {
      const nextCondition = conditions[1] as TimeRangeSingleValueCondition;
      const { time: nextValue, fieldName: payloadType } = nextCondition.payload;
      if (!conditions[0]) {
        return {
          isTimeRange: true,
          [payloadType]: { value: convertToMinutes(nextValue) },
        };
      }

      const accCondition = conditions[0] as TimeSingleValueType<string>;
      const timeRange = accCondition[payloadType];

      if (timeRange) {
        const accValue = timeRange.value;
        const value = accValue < nextValue ? accValue : nextValue;

        return {
          ...accCondition,
          [payloadType]: { value: convertToMinutes(value) },
        };
      }

      return {
        ...accCondition,
        [payloadType]: { value: convertToMinutes(nextValue) },
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

import { ItemResponseType } from 'shared/consts';
import {
  DateSingleValueCondition,
  SingleValueCondition,
  SliderRowsCondition,
  TimeRangeSingleValueCondition,
  TimeSingleValueCondition,
} from 'shared/state/Applet';

import {
  CombinedConditionType,
  ConditionWithSetType,
  EqualValueType,
  ResponseTypeForSetType,
  SliderRowsEqualValueType,
  TimeEqualValueType,
} from '../../SummaryRow.types';
import { convertToMinutes } from '../convertToMinutes';
import { convertDateToNumber } from '../convertDateToNumber';

export const getCombinedValueSet = (
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
    case ItemResponseType.Date: {
      const nextCondition = conditions[1] as DateSingleValueCondition<Date>;
      const nextValue = nextCondition.payload.date;
      if (!conditions[0]) {
        return { value: [convertDateToNumber(nextValue)] };
      }

      const accCondition = conditions[0] as EqualValueType<number | null>;
      const accValue = accCondition.value;

      return { value: accValue.concat(convertDateToNumber(nextValue)) };
    }
    case ItemResponseType.Time: {
      const nextCondition = conditions[1] as TimeSingleValueCondition;
      const nextValue = nextCondition.payload.time;
      if (!conditions[0]) {
        return { value: [convertToMinutes(nextValue)] };
      }

      const accCondition = conditions[0] as EqualValueType<number | null>;
      const accValue = accCondition.value;

      return { value: accValue.concat(convertToMinutes(nextValue)) };
    }
    case ItemResponseType.TimeRange: {
      const nextCondition = conditions[1] as TimeRangeSingleValueCondition;
      const { time: nextValue, fieldName: payloadType } = nextCondition.payload;
      if (!conditions[0]) {
        return {
          isTimeRange: true,
          [payloadType]: { value: [convertToMinutes(nextValue)] },
        };
      }

      const accCondition = conditions[0] as TimeEqualValueType<number | null>;
      const timeRange = accCondition[payloadType];

      if (timeRange) {
        const accValue = timeRange.value;

        return {
          ...accCondition,
          [payloadType]: { value: accValue.concat(convertToMinutes(nextValue)) },
        };
      }

      return {
        ...accCondition,
        [payloadType]: { value: [convertToMinutes(nextValue)] },
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

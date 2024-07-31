import { ItemResponseType } from 'shared/consts';
import {
  RangeValueCondition,
  SliderRowsCondition,
  TimeRangeValueCondition,
} from 'shared/state/Applet';

import {
  CombinedConditionType,
  ConditionWithSetType,
  RangeType,
  ResponseTypeForSetType,
  SliderRowsRangeType,
  TimeRangeType,
} from '../../SummaryRow.types';
import { convertToMinutes } from '../convertToMinutes';
import { convertDateToNumber } from '../convertDateToNumber';

export const getOutsideOfCombinedRange = (
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
        return { range: [convertDateToNumber(nextMaxValue), convertDateToNumber(nextMaxValue)] };
      }

      const accCondition = conditions[0] as RangeType<Date>;
      if (!accCondition.range.length) return accCondition;

      const accMinValue = accCondition.range[0];
      const accMaxValue = accCondition.range[1];
      const leftValue = accMinValue < nextMinValue ? accMinValue : nextMinValue;
      const rightValue = accMaxValue > nextMaxValue ? accMaxValue : nextMaxValue;

      return { range: [convertDateToNumber(leftValue), convertDateToNumber(rightValue)] };
    }
    case ItemResponseType.Time: {
      const nextCondition = conditions[1] as RangeValueCondition<string>;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      if (!conditions[0]) {
        return { range: [convertToMinutes(nextMinValue), convertToMinutes(nextMaxValue)] };
      }

      const accCondition = conditions[0] as RangeType<string>;
      if (!accCondition.range.length) return accCondition;

      const accMinValue = accCondition.range?.[0];
      const accMaxValue = accCondition.range[1];
      const leftValue = accMinValue < nextMinValue ? accMinValue : nextMinValue;
      const rightValue = accMaxValue > nextMaxValue ? accMaxValue : nextMaxValue;

      return { range: [convertToMinutes(leftValue), convertToMinutes(rightValue)] };
    }
    case ItemResponseType.TimeRange: {
      const nextCondition = conditions[1] as TimeRangeValueCondition<string>;
      const nextMinValue = nextCondition.payload.minValue;
      const nextMaxValue = nextCondition.payload.maxValue;
      const payloadType = nextCondition.payload.type;
      if (!conditions[0]) {
        return {
          isTimeRange: true,
          [payloadType]: {
            range: [convertToMinutes(nextMinValue), convertToMinutes(nextMaxValue)],
          },
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
          [payloadType]: { range: [convertToMinutes(leftValue), convertToMinutes(rightValue)] },
        };
      }

      return {
        ...accCondition,
        [payloadType]: { range: [convertToMinutes(nextMinValue), convertToMinutes(nextMaxValue)] },
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

      const accCondition = conditions[0] as SliderRowsRangeType;
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

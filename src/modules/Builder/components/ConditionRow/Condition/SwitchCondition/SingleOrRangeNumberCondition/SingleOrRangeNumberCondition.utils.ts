import { NumberItemResponseValues, SliderItemResponseValues } from 'redux/modules';
import { ConditionType } from 'shared/consts';

import { ConditionItemType, DEFAULT_NUMBER_MIN_VALUE } from '../../Condition.const';
import {
  GetConditionMinMaxRangeValuesProps,
  GetConditionMinMaxValuesProps,
} from './SingleOrRangeNumberCondition.types';

const getDefaultMinMaxValues = (state: ConditionType) => ({
  minNumber: state ? Number.MIN_SAFE_INTEGER : DEFAULT_NUMBER_MIN_VALUE,
  maxNumber: undefined,
});

const getMinNumberValue = (conditionType: ConditionType, minValue: number) => {
  if (!conditionType) return DEFAULT_NUMBER_MIN_VALUE;
  if (conditionType === ConditionType.LessThan) return minValue + 1;

  return minValue;
};

const getMaxNumberValue = (conditionType: ConditionType, maxValue: number) => {
  if (!conditionType) return Number.MAX_SAFE_INTEGER;
  if (conditionType === ConditionType.GreaterThan) return maxValue - 1;

  return maxValue;
};

export const getConditionMinMaxValues = ({
  item,
  state,
  rowIndex,
}: GetConditionMinMaxValuesProps) => {
  if (!item?.type || item.type === ConditionItemType.Score) return getDefaultMinMaxValues(state);

  switch (item.type) {
    case ConditionItemType.Slider: {
      const responseValues = item.responseValues;

      return {
        minNumber: getMinNumberValue(state, +responseValues.minValue),
        maxNumber: getMaxNumberValue(state, +responseValues.maxValue),
      };
    }
    case ConditionItemType.NumberSelection: {
      const responseValues = item.responseValues;

      return {
        minNumber: getMinNumberValue(state, responseValues.minValue),
        maxNumber: getMaxNumberValue(state, responseValues.maxValue),
      };
    }
    case ConditionItemType.SliderRows: {
      const responseValues = item.responseValues;

      return {
        minNumber: rowIndex
          ? getMinNumberValue(state, +responseValues.rows[+rowIndex].minValue)
          : DEFAULT_NUMBER_MIN_VALUE,
        maxNumber: rowIndex
          ? getMaxNumberValue(state, +responseValues.rows[+rowIndex].maxValue)
          : Number.MAX_SAFE_INTEGER,
      };
    }
    default:
      return getDefaultMinMaxValues(state);
  }
};

const getDefaultMinMaxRangeValues = () => ({
  leftRange: {
    minNumber: Number.MIN_SAFE_INTEGER,
    maxNumber: undefined,
  },
  rightRange: {
    minNumber: Number.MIN_SAFE_INTEGER,
    maxNumber: undefined,
  },
});
export const getConditionMinMaxRangeValues = ({
  item,
  minValue,
  maxValue,
  rowIndex,
}: GetConditionMinMaxRangeValuesProps) => {
  if (!item?.type || item.type === ConditionItemType.Score) return getDefaultMinMaxRangeValues();

  switch (item.type) {
    case ConditionItemType.Slider: {
      const responseValues = item.responseValues as SliderItemResponseValues;

      return {
        leftRange: {
          minNumber: +responseValues.minValue,
          maxNumber: maxValue,
        },
        rightRange: {
          minNumber: minValue,
          maxNumber: +responseValues.maxValue,
        },
      };
    }
    case ConditionItemType.NumberSelection: {
      const responseValues = item.responseValues as NumberItemResponseValues;

      return {
        leftRange: {
          minNumber: responseValues.minValue,
          maxNumber: maxValue,
        },
        rightRange: {
          minNumber: minValue,
          maxNumber: responseValues.maxValue,
        },
      };
    }
    case ConditionItemType.SliderRows: {
      const responseValues = item.responseValues;
      const minNumber = rowIndex
        ? +responseValues.rows[+rowIndex].minValue
        : DEFAULT_NUMBER_MIN_VALUE;
      const maxNumber = rowIndex
        ? +responseValues.rows[+rowIndex].maxValue
        : Number.MAX_SAFE_INTEGER;

      return {
        leftRange: {
          minNumber,
          maxNumber: maxValue,
        },
        rightRange: {
          minNumber: minValue,
          maxNumber,
        },
      };
    }
    default:
      return getDefaultMinMaxRangeValues();
  }
};

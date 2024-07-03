import { SliderItemResponseValues, NumberItemResponseValues } from 'redux/modules';
import { ConditionType } from 'shared/consts';

import { DEFAULT_NUMBER_MIN_VALUE, ConditionItemType } from '../../Condition.const';
import {
  GetConditionMinMaxValuesProps,
  GetConditionMinMaxRangeValuesProps,
} from './SingleOrRangeNumberCondition.types';

const getDefaultMinMaxValues = (state: ConditionType) => ({
  minNumber: state ? Number.MIN_SAFE_INTEGER : DEFAULT_NUMBER_MIN_VALUE,
  maxNumber: undefined,
});
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
        minNumber: state ? +responseValues.minValue : DEFAULT_NUMBER_MIN_VALUE,
        maxNumber: state ? +responseValues.maxValue : Number.MAX_SAFE_INTEGER,
      };
    }
    case ConditionItemType.NumberSelection: {
      const responseValues = item.responseValues;

      return {
        minNumber: state ? responseValues.minValue : DEFAULT_NUMBER_MIN_VALUE,
        maxNumber: state ? responseValues.maxValue : Number.MAX_SAFE_INTEGER,
      };
    }
    case ConditionItemType.SliderRows: {
      const responseValues = item.responseValues;

      return {
        minNumber:
          state && rowIndex ? +responseValues.rows[+rowIndex].minValue : DEFAULT_NUMBER_MIN_VALUE,
        maxNumber:
          state && rowIndex ? +responseValues.rows[+rowIndex].maxValue : Number.MAX_SAFE_INTEGER,
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

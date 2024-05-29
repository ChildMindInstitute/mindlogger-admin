import { NumberItemResponseValues, SliderItemResponseValues } from 'shared/state';
import { ConditionType } from 'shared/consts';

import { DEFAULT_NUMBER_MIN_VALUE, ConditionItemType } from '../Condition.const';
import { ConditionItem } from '../Condition.types';

const getDefaultMinMaxValues = (state: ConditionType) => ({
  minNumber: state ? Number.MIN_SAFE_INTEGER : DEFAULT_NUMBER_MIN_VALUE,
  maxNumber: undefined,
});
export const getConditionMinMaxValues = ({
  item,
  state,
}: {
  item?: ConditionItem;
  state: ConditionType;
}) => {
  if (!item?.type || !item.responseValues) return getDefaultMinMaxValues(state);

  switch (item.type) {
    case ConditionItemType.Slider: {
      const responseValues = item.responseValues as SliderItemResponseValues;

      return {
        minNumber: state ? +responseValues.minValue : DEFAULT_NUMBER_MIN_VALUE,
        maxNumber: state ? +responseValues.maxValue : Number.MAX_SAFE_INTEGER,
      };
    }
    case ConditionItemType.NumberSelection: {
      const responseValues = item.responseValues as NumberItemResponseValues;

      return {
        minNumber: state ? responseValues.minValue : DEFAULT_NUMBER_MIN_VALUE,
        maxNumber: state ? responseValues.maxValue : Number.MAX_SAFE_INTEGER,
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
}: {
  item?: ConditionItem;
  minValue: number;
  maxValue: number;
}) => {
  if (!item?.type || !item.responseValues) return getDefaultMinMaxRangeValues();

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
    default:
      return getDefaultMinMaxRangeValues();
  }
};

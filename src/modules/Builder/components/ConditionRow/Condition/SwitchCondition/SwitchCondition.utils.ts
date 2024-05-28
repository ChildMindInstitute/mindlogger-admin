import { SliderItemResponseValues } from 'shared/state';
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
  if (!item?.type) return getDefaultMinMaxValues(state);

  switch (item.type) {
    case ConditionItemType.Slider:
      return {
        minNumber: state
          ? +(item.responseValues! as SliderItemResponseValues).minValue
          : DEFAULT_NUMBER_MIN_VALUE,
        maxNumber: state
          ? +(item.responseValues! as SliderItemResponseValues).maxValue
          : Number.MAX_SAFE_INTEGER,
      };
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
  if (!item?.type) return getDefaultMinMaxRangeValues();

  switch (item.type) {
    case ConditionItemType.Slider:
      return {
        leftRange: {
          minNumber: +(item.responseValues! as SliderItemResponseValues).minValue,
          maxNumber: maxValue,
        },
        rightRange: {
          minNumber: minValue,
          maxNumber: +(item.responseValues! as SliderItemResponseValues).maxValue,
        },
      };
    default:
      return getDefaultMinMaxRangeValues();
  }
};

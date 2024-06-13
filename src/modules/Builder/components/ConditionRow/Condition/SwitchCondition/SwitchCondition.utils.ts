import i18n from 'i18n';
import {
  NumberItemResponseValues,
  SingleAndMultipleSelectRowsResponseValues,
  SliderItemResponseValues,
  TimeRangeConditionType,
} from 'shared/state';
import { ConditionType } from 'shared/consts';
import { Option } from 'shared/components/FormComponents/SelectController/SelectController.types';

import { DEFAULT_NUMBER_MIN_VALUE, ConditionItemType } from '../Condition.const';
import {
  NumberSelectionConditionItem,
  ScoreConditionItem,
  SliderConditionItem,
} from '../Condition.types';
import { GetConditionMinMaxRangeValuesProps } from './SwitchCondition.types';

const { t } = i18n;

const getDefaultMinMaxValues = (state: ConditionType) => ({
  minNumber: state ? Number.MIN_SAFE_INTEGER : DEFAULT_NUMBER_MIN_VALUE,
  maxNumber: undefined,
});
export const getConditionMinMaxValues = ({
  item,
  state,
}: {
  item?: SliderConditionItem | NumberSelectionConditionItem | ScoreConditionItem;
  state: ConditionType;
}) => {
  if (!item?.type || item.type === ConditionItemType.Score) return getDefaultMinMaxValues(state);

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
    default:
      return getDefaultMinMaxRangeValues();
  }
};

export const getTimeRangeOptions = () => [
  { value: TimeRangeConditionType.StartTime, labelKey: t('startTime') },
  { value: TimeRangeConditionType.EndTime, labelKey: t('endTime') },
];

export const getRowOptions = (rows: SingleAndMultipleSelectRowsResponseValues['rows']): Option[] =>
  (rows ?? []).map((row) => ({
    value: row.id,
    labelKey: `${t('row')}: ${row.rowName}`,
  }));

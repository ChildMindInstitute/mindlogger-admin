import i18n from 'i18n';
import {
  NumberItemResponseValues,
  SingleAndMultipleSelectRowsResponseValues,
  SliderItemResponseValues,
  TimeRangeConditionType,
} from 'shared/state';
import { ConditionType } from 'shared/consts';
import { Option } from 'shared/components/FormComponents/SelectController/SelectController.types';
import {
  SingleAndMultipleSelectRow,
  SliderRowsItemResponseValues,
  SliderRowsResponseValues,
} from 'shared/state/Applet/Applet.schema';

import { DEFAULT_NUMBER_MIN_VALUE, ConditionItemType } from '../Condition.const';
import {
  GetConditionMinMaxRangeValuesProps,
  GetConditionMinMaxValuesProps,
} from './SwitchCondition.types';

const { t } = i18n;

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

export const getRowOptions = (
  rows: SingleAndMultipleSelectRowsResponseValues['rows'] | SliderRowsResponseValues['rows'],
): Option[] =>
  (rows ?? []).map((row, index) => ({
    value: String(index),
    labelKey: (row as SingleAndMultipleSelectRow).rowName
      ? `${t('row')}: ${(row as SingleAndMultipleSelectRow).rowName}`
      : `${t('slider')}: ${(row as SliderRowsItemResponseValues).label}`,
  }));

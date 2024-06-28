import i18n from 'i18n';
import { SingleAndMultipleSelectRowsResponseValues, TimeRangeConditionType } from 'shared/state';
import { Option } from 'shared/components/FormComponents/SelectController/SelectController.types';
import {
  SingleAndMultipleSelectRow,
  SliderRowsItemResponseValues,
  SliderRowsResponseValues,
} from 'shared/state/Applet/Applet.schema';

const { t } = i18n;

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

import i18n from 'i18n';

import { DateRangePickerType } from './DateRangePicker.types';

const { t } = i18n;

export const getDateTypeOptions = () => [
  {
    value: DateRangePickerType.AllTime,
    labelKey: t('exportDateRange.allTime'),
  },
  {
    value: DateRangePickerType.Last24h,
    labelKey: t('exportDateRange.last24h'),
  },
  {
    value: DateRangePickerType.LastWeek,
    labelKey: t('exportDateRange.lastWeek'),
  },
  {
    value: DateRangePickerType.LastMonth,
    labelKey: t('exportDateRange.lastMonth'),
  },
  {
    value: DateRangePickerType.ChooseDates,
    labelKey: t('exportDateRange.chooseDates'),
  },
];

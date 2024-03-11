import i18n from 'i18n';

import { ExportDateType } from './ExportDataSettings.types';

const { t } = i18n;

export const getDateTypeOptions = () => [
  {
    value: ExportDateType.AllTime,
    labelKey: t('exportDateRange.allTime'),
  },
  {
    value: ExportDateType.Last24h,
    labelKey: t('exportDateRange.last24h'),
  },
  {
    value: ExportDateType.LastWeek,
    labelKey: t('exportDateRange.lastWeek'),
  },
  {
    value: ExportDateType.LastMonth,
    labelKey: t('exportDateRange.lastMonth'),
  },
  {
    value: ExportDateType.ChooseDates,
    labelKey: t('exportDateRange.chooseDates'),
  },
];

import { RetentionPeriods } from 'shared/types';

export const retentionTypes = [
  {
    value: RetentionPeriods.Indefinitely,
    labelKey: 'indefinitely',
  },
  {
    value: RetentionPeriods.Days,
    labelKey: 'days',
  },
  {
    value: RetentionPeriods.Weeks,
    labelKey: 'weeks',
  },
  {
    value: RetentionPeriods.Months,
    labelKey: 'months',
  },
  {
    value: RetentionPeriods.Years,
    labelKey: 'years',
  },
];

export const DEFAULT_RETENTION_PERIOD = 1;
export const DEFAULT_RETENTION_TYPE = RetentionPeriods.Indefinitely;

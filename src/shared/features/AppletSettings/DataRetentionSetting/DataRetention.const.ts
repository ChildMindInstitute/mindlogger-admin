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

export const defaultValues = {
  retentionPeriod: 1,
  retentionType: RetentionPeriods.Indefinitely,
};

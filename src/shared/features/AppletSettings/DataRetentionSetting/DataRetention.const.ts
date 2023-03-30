import { RetentionPeriods } from 'shared/state';

export const periods = [
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
  periodNumber: 1,
  period: RetentionPeriods.Indefinitely,
};

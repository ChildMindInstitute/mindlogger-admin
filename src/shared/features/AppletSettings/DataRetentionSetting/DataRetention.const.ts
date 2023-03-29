import { Periods } from './DataRetention.types';

export const periods = [
  {
    value: Periods.Indefinitely,
    labelKey: 'indefinitely',
  },
  {
    value: Periods.Day,
    labelKey: 'days',
  },
  {
    value: Periods.Week,
    labelKey: 'weeks',
  },
  {
    value: Periods.Month,
    labelKey: 'months',
  },
  {
    value: Periods.Year,
    labelKey: 'years',
  },
];

export const defaultValues = {
  periodNumber: 1,
  period: Periods.Indefinitely,
};

import { Periodicity } from 'modules/Dashboard/api';

export const availabilityOptions = [
  {
    value: true,
    labelKey: 'alwaysAvailable',
  },
  {
    value: false,
    labelKey: 'scheduledAccess',
  },
];

export const repeatsButtons = [
  {
    value: Periodicity.Once,
    label: 'once',
  },
  {
    value: Periodicity.Daily,
    label: 'daily',
  },
  {
    value: Periodicity.Weekly,
    label: 'weekly',
  },
  {
    value: Periodicity.Weekdays,
    label: 'weekdays',
  },
  {
    value: Periodicity.Monthly,
    label: 'monthly',
  },
];

export enum TimeType {
  FromTime,
  ToTime,
}

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

export const enum Repeats {
  once = 'once',
  daily = 'daily',
  weekly = 'weekly',
  weekdays = 'weekdays',
  monthly = 'monthly',
}

export const repeatsButtons = [
  {
    value: Repeats.once,
    label: 'Once',
  },
  {
    value: Repeats.daily,
    label: 'Daily',
  },
  {
    value: Repeats.weekly,
    label: 'Weekly',
  },
  {
    value: Repeats.weekdays,
    label: 'Weekdays',
  },
  {
    value: Repeats.monthly,
    label: 'Monthly',
  },
];

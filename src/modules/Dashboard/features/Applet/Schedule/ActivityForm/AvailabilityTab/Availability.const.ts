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
  Once = 'once',
  Daily = 'daily',
  Weekly = 'weekly',
  Weekdays = 'weekdays',
  Monthly = 'monthly',
}

export const repeatsButtons = [
  {
    value: Repeats.Once,
    label: 'once',
  },
  {
    value: Repeats.Daily,
    label: 'daily',
  },
  {
    value: Repeats.Weekly,
    label: 'weekly',
  },
  {
    value: Repeats.Weekdays,
    label: 'weekdays',
  },
  {
    value: Repeats.Monthly,
    label: 'monthly',
  },
];

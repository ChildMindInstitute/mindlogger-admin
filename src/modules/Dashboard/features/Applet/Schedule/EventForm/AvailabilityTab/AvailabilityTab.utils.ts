export const getAvailabilityOptions = (hasAlwaysAvailableOption?: boolean) => [
  {
    value: true,
    labelKey: 'alwaysAvailable',
    itemDisabled: !hasAlwaysAvailableOption,
    disabled: !hasAlwaysAvailableOption,
  },
  {
    value: false,
    labelKey: 'scheduledAccess',
  },
];

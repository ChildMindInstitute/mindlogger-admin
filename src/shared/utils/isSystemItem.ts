import { LookupTableItems } from 'shared/consts';

export const isSystemItem = (name: string) =>
  name === LookupTableItems.Age_screen || name === LookupTableItems.Gender_screen;

import { format } from 'date-fns';

import { DateFormats } from 'consts';

export const getDatesStringsArray = (value: string) =>
  value?.split('-').map((element) => element.trim());

export const getStringFromDate = (date: Date) => String(format(date, DateFormats.DayMonthYear));

export const getDateFromString = (value: string) => new Date(value);

import { format } from 'date-fns';

export const getDatesStringsArray = (value: string) =>
  value?.split('-').map((element) => element.trim());

export const getStringFromDate = (date: Date) => String(format(date, 'dd MMM yyyy'));

export const getDateFromString = (value: string) => new Date(value);

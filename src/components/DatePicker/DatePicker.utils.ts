import { format } from 'date-fns';

import { DAY_FORMAT } from 'utils/constants';

export const getDatesStringsArray = (value: string) =>
  value?.split('-').map((element) => element.trim());

export const getStringFromDate = (date: Date) => String(format(date, DAY_FORMAT));

export const getDateFromString = (value: string) => new Date(value);

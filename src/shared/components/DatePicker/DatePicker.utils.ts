import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';

export const getStringFromDate = (date: Date | null) => (date ? String(format(date, DateFormats.DayMonthYear)) : '');

export const getStringFromDateWithWeekDay = (date: Date | null) =>
  date && String(format(date, DateFormats.WeekDayMonthYear));

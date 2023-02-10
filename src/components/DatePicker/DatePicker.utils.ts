import { format } from 'date-fns';

import { DateFormats } from 'consts';

export const getStringFromDate = (date: Date | null) =>
  date && String(format(date, DateFormats.DayMonthYear));

export const getStringFromDateWithWeekDay = (date: Date | null) =>
  date && String(format(date, DateFormats.WeekDayMonthYear));

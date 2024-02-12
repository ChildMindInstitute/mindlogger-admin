import { DateLocalizer } from 'react-big-calendar';
import { firstVisibleDay, lastVisibleDay } from 'react-big-calendar/lib/utils/dates';
import { add } from 'date-fns';
import uniqueId from 'lodash.uniqueid';

import { EN_WEEK_DAYS, FR_WEEK_DAYS, MILLISECONDS_PER_WEEK } from './MonthCalendar.const';
import { MonthObject, Week } from './MonthCalendar.types';

export const shortWeekDaysArray = (langLocale: Intl.LocalesArgument) =>
  langLocale === 'en' ? EN_WEEK_DAYS : FR_WEEK_DAYS;

export const createCalendar = (currentDate: string | Date, localizer: DateLocalizer) => {
  const date = new Date(currentDate);
  const first: Date = firstVisibleDay(date, localizer);
  const last: Date = lastVisibleDay(date, localizer);
  const weeksCount = Math.round(Math.abs(last.getTime() - first.getTime()) / MILLISECONDS_PER_WEEK);
  const calendar: MonthObject = { date, first, last, weeks: [] };

  for (let weekNumber = 0; weekNumber < weeksCount; weekNumber++) {
    const week: Week = { days: [], id: uniqueId('week') };
    calendar.weeks.push(week);
    calendar.year = date.getFullYear();
    calendar.month = date.getMonth();

    for (let day = 7 * weekNumber; day < 7 * (weekNumber + 1); day++) {
      const date = add(first, { days: day });
      week.days.push(date);
    }
  }

  return calendar;
};

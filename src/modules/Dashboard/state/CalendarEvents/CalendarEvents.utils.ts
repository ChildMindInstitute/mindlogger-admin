import uniqueId from 'lodash.uniqueid';
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  getDate,
  getDay,
  isWeekend,
  setHours,
  setMinutes,
  setSeconds,
  endOfYear,
  startOfYear,
  format,
} from 'date-fns';

import { DateFormats } from 'shared/consts';
import { Periodicity } from 'modules/Dashboard/api';

import { CalendarEvent, CreateEventsData } from './CalendarEvents.schema';

export const getPreparedEvents = (
  events: CalendarEvent[],
  isHidden: boolean,
  isAlwaysAvailable: boolean,
) =>
  events.map((item) => {
    const condition = isAlwaysAvailable ? item.alwaysAvailable : !item.alwaysAvailable;
    if (condition) {
      return {
        ...item,
        isHidden,
      };
    }

    return item;
  });

export const getNotHiddenEvents = (events: CalendarEvent[]) =>
  events.filter((event) => !event.isHidden);

export const getStartOfYearDateTime = (year: number) => startOfYear(new Date(year, 0, 1));
export const getEndOfYearDateTime = (year: number) => endOfYear(new Date(year, 0, 1));

export const getDateFromDateTimeString = (date: Date, time: string) => {
  const [hours, minutes, seconds] = time.split(':');

  return setSeconds(setMinutes(setHours(date, Number(hours)), Number(minutes)), Number(seconds));
};

const getDateFromDateStringTimeString = (date: string, time: string) => new Date(`${date}T${time}`);

const getEventStartDateTime = (
  periodicity: Periodicity,
  selectedDate: string,
  startDate: string,
  startTime: string,
  nextYearDateString: string | null,
) => {
  const nextYearDate = getDateFromDateStringTimeString(
    nextYearDateString || format(new Date(), DateFormats.YearMonthDay),
    '00:00:00',
  );
  const nextYearDateWithTime = getDateFromDateStringTimeString(
    nextYearDateString || format(new Date(), DateFormats.YearMonthDay),
    startTime,
  );
  const selectedDateToDate = getDateFromDateStringTimeString(selectedDate, '00:00:00');
  const selectedDateToDateWithTime = getDateFromDateStringTimeString(selectedDate, startTime);
  const startDateToDateWithTime = getDateFromDateStringTimeString(startDate, startTime);

  const dateAlways = nextYearDate > selectedDateToDate ? nextYearDate : selectedDateToDate;
  const dateScheduled =
    nextYearDateWithTime > selectedDateToDateWithTime
      ? nextYearDateWithTime
      : selectedDateToDateWithTime;
  const dateDailyWeekdays =
    nextYearDateWithTime > startDateToDateWithTime ? nextYearDateWithTime : startDateToDateWithTime;

  switch (periodicity) {
    case Periodicity.Always:
      return dateAlways;
    case Periodicity.Once:
    case Periodicity.Weekly:
    case Periodicity.Monthly:
      return dateScheduled;
    case Periodicity.Daily:
    case Periodicity.Weekdays:
      return dateDailyWeekdays;
  }
};

const getEventEndDateTime = (
  periodicity: Periodicity,
  selectedDate: string,
  endDate: string,
  endTime: string,
  currentYear: number,
  eventStart: Date,
) => {
  const endOfYearDateTime = getEndOfYearDateTime(currentYear);
  const calculatedEndDate =
    eventStart > endOfYearDateTime ? eventStart : getEndOfYearDateTime(currentYear);

  switch (periodicity) {
    case Periodicity.Always:
      return calculatedEndDate;
    case Periodicity.Once:
      return getDateFromDateStringTimeString(selectedDate, endTime);
    case Periodicity.Daily:
    case Periodicity.Weekly:
    case Periodicity.Weekdays:
    case Periodicity.Monthly:
      return endDate ? getDateFromDateStringTimeString(endDate, endTime) : calculatedEndDate;
  }
};

const getEventsArrayFromDates = (
  dates: Date[],
  commonProps: Omit<CalendarEvent, 'id' | 'start' | 'end'>,
  startTime: string,
  endTime: string,
) =>
  dates.map((date) => ({
    ...commonProps,
    id: uniqueId('event-'),
    start: getDateFromDateTimeString(date, startTime),
    end: getDateFromDateTimeString(date, endTime),
  }));

export const createEvents = ({
  activityOrFlowId,
  activityOrFlowName,
  periodicityType,
  selectedDate,
  startDate,
  endDate,
  startTime,
  endTime,
  isAlwaysAvailable,
  colors,
  flowId,
  nextYearDateString,
  currentYear,
}: CreateEventsData): CalendarEvent[] => {
  const eventStart = getEventStartDateTime(
    periodicityType,
    selectedDate,
    startDate,
    startTime,
    nextYearDateString,
  );
  const eventEnd = getEventEndDateTime(
    periodicityType,
    selectedDate,
    endDate,
    endTime,
    currentYear,
    eventStart,
  );
  const isAllDayEvent = startTime === '00:00:00' && endTime === '23:59:00';

  const getBgColor = () => {
    if (isAlwaysAvailable) return colors[0];
    if (isAllDayEvent) return colors[1];

    return 'transparent';
  };

  const commonProps = {
    resourceId: activityOrFlowId,
    title: activityOrFlowName,
    alwaysAvailable: isAlwaysAvailable,
    startFlowIcon: !!flowId,
    isHidden: false,
    backgroundColor: getBgColor(),
    allDay: isAllDayEvent,
    ...(!isAlwaysAvailable && {
      scheduledColor: colors[0],
      scheduledBackground: colors[1],
    }),
  };

  if (periodicityType === Periodicity.Always) {
    return [
      {
        ...commonProps,
        id: uniqueId('event-'),
        start: eventStart,
        end: eventEnd,
      },
    ];
  }

  if (periodicityType === Periodicity.Once) {
    return [
      {
        ...commonProps,
        id: uniqueId('event-'),
        start: eventStart,
        end: eventEnd,
      },
    ];
  }

  const daysInPeriod =
    eventEnd > eventStart ? eachDayOfInterval({ start: eventStart, end: eventEnd }) : [];

  if (periodicityType === Periodicity.Daily) {
    return getEventsArrayFromDates(daysInPeriod, commonProps, startTime, endTime);
  }

  if (periodicityType === Periodicity.Weekly) {
    const dayOfWeek = getDay(new Date(selectedDate));
    const weeklyDays = daysInPeriod.filter((date) => getDay(date) === dayOfWeek);

    return getEventsArrayFromDates(weeklyDays, commonProps, startTime, endTime);
  }

  if (periodicityType === Periodicity.Weekdays) {
    const weekDays = daysInPeriod.filter((date) => !isWeekend(date));

    return getEventsArrayFromDates(weekDays, commonProps, startTime, endTime);
  }

  if (periodicityType === Periodicity.Monthly) {
    const chosenDate = getDate(new Date(selectedDate));
    const monthsBetween = eachMonthOfInterval({ start: eventStart, end: eventEnd });

    const daysOfMonth = monthsBetween.map((month) => {
      const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      const dayOfMonth = Math.min(chosenDate, lastDayOfMonth.getDate());

      return new Date(month.getFullYear(), month.getMonth(), dayOfMonth);
    });

    return getEventsArrayFromDates(daysOfMonth, commonProps, startTime, endTime);
  }

  return [];
};

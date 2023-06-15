import uniqueId from 'lodash.uniqueid';
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfYear,
  getDate,
  getDay,
  isWeekend,
  setHours,
  setMinutes,
  setSeconds,
  startOfYear,
} from 'date-fns';

import { Periodicity } from 'modules/Dashboard/api';
import {
  formatToWeekYear,
  formatToYearMonthDate,
} from 'modules/Dashboard/features/Applet/Schedule/Calendar/Calendar.utils';
import { getNormalizedTimezoneDate } from 'shared/utils';

import {
  CalendarEvent,
  CreateEventsData,
  AllDayEventsSortedByDaysItem,
} from './CalendarEvents.schema';

const LENGTH_TO_SET_ID_IS_HIDDEN = 2;
const LENGTH_TO_FILTER_DAYS_EVENTS = 3;
const DEFAULT_START_TIME = '00:00:00';
const DEFAULT_END_TIME = '23:59:00';

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

export const getEventsWithHiddenInTimeView = (notHiddenEvents: CalendarEvent[]) => {
  const allDayEventsSortedByDaysMap = notHiddenEvents.reduce(
    (acc: Map<string, AllDayEventsSortedByDaysItem>, calendarEvent) => {
      const currentEventStartDate = formatToYearMonthDate(calendarEvent.start);
      const currentEventWeek = formatToWeekYear(calendarEvent.start);
      const eventsIds = acc.get(currentEventStartDate)?.eventsIds;

      if (calendarEvent.allDay || calendarEvent.alwaysAvailable) {
        acc.set(currentEventStartDate, {
          eventsIds:
            eventsIds && acc.has(currentEventStartDate)
              ? [
                  ...eventsIds,
                  {
                    id: calendarEvent.id,
                    isHiddenInTimeView: eventsIds.length > LENGTH_TO_SET_ID_IS_HIDDEN,
                  },
                ]
              : [{ id: calendarEvent.id, isHiddenInTimeView: false }],
          week: currentEventWeek,
          date: currentEventStartDate,
        });
      }

      return acc;
    },
    new Map(),
  );

  const allDayEventsSortedByDays = Array.from(allDayEventsSortedByDaysMap.values()).filter(
    (item) => item.eventsIds.length > LENGTH_TO_FILTER_DAYS_EVENTS,
  );

  const hiddenEventsIds = allDayEventsSortedByDays.reduce((acc: string[], item) => {
    item.eventsIds.forEach((item) => item.isHiddenInTimeView && acc.push(item.id));

    return acc;
  }, []);

  const eventsToShow = notHiddenEvents.map((event) => ({
    ...event,
    isHiddenInTimeView: hiddenEventsIds.some((id) => id === event.id),
  }));

  return {
    eventsToShow,
    allDayEventsSortedByDays,
    hiddenEventsIds,
  };
};

export const getStartOfYearDateTime = (year: number) => startOfYear(new Date(year, 0, 1));
export const getEndOfYearDateTime = (year: number) => endOfYear(new Date(year, 0, 1));

export const getDateFromDateTimeString = (date: Date, time: string) => {
  const [hours, minutes, seconds] = time.split(':');

  return setSeconds(setMinutes(setHours(date, Number(hours)), Number(minutes)), Number(seconds));
};

const getDateFromDateStringTimeString = (date: string | null, time: string) =>
  date && new Date(`${date}T${time}`);

const getEventStartDateTime = (
  periodicity: Periodicity,
  selectedDate: string | null,
  startDate: string | null,
  startTime: string,
  nextYearDateString: string | null,
) => {
  const nextYearDate =
    nextYearDateString && getDateFromDateStringTimeString(nextYearDateString, DEFAULT_START_TIME);

  const nextYearDateWithTime =
    nextYearDateString && getDateFromDateStringTimeString(nextYearDateString, startTime);

  const selectedDateToDate = getDateFromDateStringTimeString(selectedDate, DEFAULT_START_TIME);
  const selectedDateToDateWithTime = getDateFromDateStringTimeString(selectedDate, startTime);
  const startDateToDateWithTime = getDateFromDateStringTimeString(startDate, startTime);

  const dateAlways =
    nextYearDate &&
    selectedDateToDate &&
    nextYearDate.getFullYear() > selectedDateToDate.getFullYear()
      ? nextYearDate
      : selectedDateToDate;

  const dateScheduled =
    nextYearDateWithTime &&
    selectedDateToDateWithTime &&
    nextYearDateWithTime.getFullYear() > selectedDateToDateWithTime.getFullYear()
      ? nextYearDateWithTime
      : selectedDateToDateWithTime;

  const dateDailyWeekdays =
    nextYearDateWithTime &&
    startDateToDateWithTime &&
    nextYearDateWithTime.getFullYear() > startDateToDateWithTime.getFullYear()
      ? nextYearDateWithTime
      : startDateToDateWithTime;

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
  selectedDate: string | null,
  endDate: string | null,
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
  startTime?: string,
  endTime?: string,
) =>
  dates.map((date) => ({
    ...commonProps,
    id: uniqueId('event-'),
    start: getDateFromDateTimeString(date, startTime || DEFAULT_START_TIME),
    end: getDateFromDateTimeString(date, endTime || DEFAULT_END_TIME),
    eventCurrentDate: formatToYearMonthDate(date),
  }));

export const createEvents = ({
  activityOrFlowId,
  eventId,
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
  oneTimeCompletion,
  accessBeforeSchedule,
  timerType,
  timer,
  notification,
}: CreateEventsData): CalendarEvent[] => {
  const newDate = new Date();
  const eventStart =
    getEventStartDateTime(
      periodicityType,
      selectedDate,
      startDate,
      startTime,
      nextYearDateString,
    ) || newDate;
  const eventEnd =
    getEventEndDateTime(periodicityType, selectedDate, endDate, endTime, currentYear, eventStart) ||
    newDate;
  const isAllDayEvent =
    isAlwaysAvailable || (startTime === DEFAULT_START_TIME && endTime === DEFAULT_END_TIME);

  const getBgColor = () => {
    if (isAlwaysAvailable) return colors[0];
    if (isAllDayEvent) return colors[1];

    return 'transparent';
  };

  const commonProps = {
    activityOrFlowId,
    eventId,
    title: activityOrFlowName,
    alwaysAvailable: isAlwaysAvailable,
    startFlowIcon: !!flowId,
    isHidden: false,
    backgroundColor: getBgColor(),
    periodicity: periodicityType,
    eventStart:
      getDateFromDateStringTimeString(startDate || selectedDate, startTime || DEFAULT_START_TIME) ||
      newDate,
    eventEnd: endDate === null ? null : eventEnd,
    oneTimeCompletion,
    accessBeforeSchedule,
    timerType,
    timer,
    notification,
    endAlertIcon: !!notification,
    allDay: isAllDayEvent,
    ...(!isAlwaysAvailable && {
      scheduledColor: colors[0],
      scheduledBackground: colors[1],
    }),
  };

  if (periodicityType === Periodicity.Once) {
    return [
      {
        ...commonProps,
        id: uniqueId('event-'),
        start: eventStart,
        end: eventEnd,
        eventCurrentDate: formatToYearMonthDate(eventStart),
      },
    ];
  }

  const daysInPeriod =
    eventEnd && eventStart && eventEnd > eventStart
      ? eachDayOfInterval({ start: eventStart, end: eventEnd })
      : [];

  if (periodicityType === Periodicity.Always || periodicityType === Periodicity.Daily) {
    return getEventsArrayFromDates(daysInPeriod, commonProps, startTime, endTime);
  }

  if (periodicityType === Periodicity.Weekly && selectedDate) {
    const dayOfWeek = getDay(getNormalizedTimezoneDate(selectedDate));
    const weeklyDays = daysInPeriod.filter((date) => getDay(date) === dayOfWeek);

    return getEventsArrayFromDates(weeklyDays, commonProps, startTime, endTime);
  }

  if (periodicityType === Periodicity.Weekdays) {
    const weekDays = daysInPeriod.filter((date) => !isWeekend(date));

    return getEventsArrayFromDates(weekDays, commonProps, startTime, endTime);
  }

  if (periodicityType === Periodicity.Monthly && selectedDate) {
    const chosenDate = getDate(getNormalizedTimezoneDate(selectedDate));
    const monthsBetween =
      eventEnd && eventStart && eventEnd > eventStart
        ? eachMonthOfInterval({
            start: eventStart,
            end: eventEnd,
          })
        : [];

    const daysOfMonth = monthsBetween.map((month) => {
      const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      const dayOfMonth = Math.min(chosenDate, lastDayOfMonth.getDate());

      return new Date(month.getFullYear(), month.getMonth(), dayOfMonth);
    });

    return getEventsArrayFromDates(daysOfMonth, commonProps, startTime, endTime);
  }

  return [];
};

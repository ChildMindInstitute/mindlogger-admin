import uniqueId from 'lodash.uniqueid';
import {
  addDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfYear,
  getDate,
  getDay,
  isWeekend,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
  startOfYear,
} from 'date-fns';

import { Periodicity } from 'modules/Dashboard/api';
import { formatToWeekYear, formatToYearMonthDate } from 'shared/utils/dateFormat';
import { getNormalizedTimezoneDate } from 'shared/utils/dateTimezone';

import {
  CalendarEvent,
  CreateEventsData,
  AllDayEventsSortedByDaysItem,
  GetDaysInMonthlyPeriodicity,
  GetDateFromDateStringTimeString,
  GetEventStartDateTime,
  GetEventEndDateTime,
  GetEventsArrayFromDates,
} from './CalendarEvents.schema';

const LENGTH_TO_SET_ID_IS_HIDDEN = 2;
const LENGTH_TO_FILTER_DAYS_EVENTS = 3;
const DEFAULT_START_TIME = '00:00:00';
const DEFAULT_END_TIME = '23:59:00';
const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

export const getPreparedEvents = (
  events: CalendarEvent[],
  isAlwaysAvailableHidden: boolean,
  isScheduledHidden: boolean,
) =>
  events.map((item) => ({
    ...item,
    isHidden: item.alwaysAvailable ? isAlwaysAvailableHidden : isScheduledHidden,
  }));

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
  if (!timeRegex.test(time)) return date;

  const [hours, minutes, seconds] = time.split(':');

  return setSeconds(setMinutes(setHours(date, Number(hours)), Number(minutes)), Number(seconds));
};

export const getDateFromDateStringTimeString = ({
  date,
  time,
}: GetDateFromDateStringTimeString) => {
  if (!date) return null;

  return new Date(`${date}T${time ?? DEFAULT_START_TIME}`);
};

export const getEventStartDateTime = ({
  periodicity,
  selectedDate,
  startDate,
  startTime,
  nextYearDateString,
}: GetEventStartDateTime) => {
  const nextYearDate =
    nextYearDateString &&
    getDateFromDateStringTimeString({ date: nextYearDateString, time: DEFAULT_START_TIME });

  const nextYearDateWithTime =
    nextYearDateString &&
    getDateFromDateStringTimeString({ date: nextYearDateString, time: startTime });

  const selectedDateToDate = getDateFromDateStringTimeString({
    date: selectedDate,
    time: DEFAULT_START_TIME,
  });
  const selectedDateToDateWithTime = getDateFromDateStringTimeString({
    date: selectedDate,
    time: startTime,
  });
  const startDateToDateWithTime = getDateFromDateStringTimeString({
    date: startDate,
    time: startTime,
  });

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

export const getEventEndDateTime = ({
  periodicity,
  selectedDate,
  endDate,
  endTime,
  currentYear,
  eventStart,
  isCrossDayEvent,
}: GetEventEndDateTime) => {
  const endOfYearDateTime = getEndOfYearDateTime(currentYear);
  const calculatedEndDate = eventStart > endOfYearDateTime ? eventStart : endOfYearDateTime;
  const time = isCrossDayEvent ? DEFAULT_END_TIME : endTime;

  switch (periodicity) {
    case Periodicity.Always:
      return calculatedEndDate;
    case Periodicity.Once:
      return getDateFromDateStringTimeString({
        date: selectedDate,
        time,
      });
    case Periodicity.Daily:
    case Periodicity.Weekly:
    case Periodicity.Weekdays:
    case Periodicity.Monthly:
      return endDate
        ? getDateFromDateStringTimeString({
            date: endDate,
            time,
          })
        : calculatedEndDate;
  }
};

export const getEventsArrayFromDates = ({
  dates,
  commonProps,
  startTime,
  endTime,
  isCrossDayEvent,
}: GetEventsArrayFromDates) =>
  dates.flatMap((date) => {
    const nextDay = addDays(date, 1);

    if (isCrossDayEvent) {
      return [
        {
          ...commonProps,
          id: uniqueId('event-'),
          start: getDateFromDateTimeString(date, startTime || DEFAULT_START_TIME),
          end: getDateFromDateTimeString(date, DEFAULT_END_TIME),
          eventCurrentDate: formatToYearMonthDate(date),
          eventSpanAfter: true,
        },
        {
          ...commonProps,
          id: uniqueId('event-'),
          start: getDateFromDateTimeString(nextDay, DEFAULT_START_TIME),
          end: getDateFromDateTimeString(nextDay, endTime || DEFAULT_END_TIME),
          eventCurrentDate: formatToYearMonthDate(nextDay),
          eventSpanBefore: true,
        },
      ];
    } else {
      return [
        {
          ...commonProps,
          id: uniqueId('event-'),
          start: getDateFromDateTimeString(date, startTime || DEFAULT_START_TIME),
          end: getDateFromDateTimeString(date, endTime || DEFAULT_END_TIME),
          eventCurrentDate: formatToYearMonthDate(date),
        },
      ];
    }
  });

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
  const isCrossDayEvent =
    !!startTime &&
    !!endTime &&
    getNextDayComparison(removeSecondsFromTime(startTime)!, removeSecondsFromTime(endTime)!);
  const eventStart =
    getEventStartDateTime({
      periodicity: periodicityType,
      selectedDate,
      startDate,
      startTime,
      nextYearDateString,
    }) || newDate;
  const eventEnd =
    getEventEndDateTime({
      periodicity: periodicityType,
      selectedDate,
      endDate,
      endTime,
      currentYear,
      eventStart,
      isCrossDayEvent,
    }) || newDate;
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
      getDateFromDateStringTimeString({
        date: startDate || selectedDate,
        time: startTime || DEFAULT_START_TIME,
      }) || newDate,
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
    startTime: removeSecondsFromTime(startTime),
    endTime: removeSecondsFromTime(endTime),
  };

  if (periodicityType === Periodicity.Once) {
    const nextDay = addDays(eventStart, 1);

    return isCrossDayEvent
      ? [
          {
            ...commonProps,
            id: uniqueId('event-'),
            start: eventStart,
            end: getDateFromDateStringTimeString({
              date: selectedDate,
              time: DEFAULT_END_TIME,
            }) as Date,
            eventCurrentDate: formatToYearMonthDate(eventStart),
            eventSpanAfter: true,
          },
          {
            ...commonProps,
            id: uniqueId('event-'),
            start: startOfDay(nextDay),
            end: getDateFromDateTimeString(nextDay, endTime),
            eventCurrentDate: formatToYearMonthDate(nextDay),
            eventSpanBefore: true,
          },
        ]
      : [
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
    eventEnd && eventStart && eventEnd >= eventStart
      ? eachDayOfInterval({ start: eventStart, end: eventEnd })
      : [];

  if (periodicityType === Periodicity.Always || periodicityType === Periodicity.Daily) {
    return getEventsArrayFromDates({
      dates: daysInPeriod,
      commonProps,
      startTime,
      endTime,
      isCrossDayEvent,
    });
  }

  if (periodicityType === Periodicity.Weekly && selectedDate) {
    const dayOfWeek = getDay(getNormalizedTimezoneDate(selectedDate));
    const weeklyDays = daysInPeriod.filter((date) => getDay(date) === dayOfWeek);

    return getEventsArrayFromDates({
      dates: weeklyDays,
      commonProps,
      startTime,
      endTime,
      isCrossDayEvent,
    });
  }

  if (periodicityType === Periodicity.Weekdays) {
    const weekDays = daysInPeriod.filter((date) => !isWeekend(date));

    return getEventsArrayFromDates({
      dates: weekDays,
      commonProps,
      startTime,
      endTime,
      isCrossDayEvent,
    });
  }

  if (periodicityType === Periodicity.Monthly && selectedDate) {
    const chosenDate = getDate(getNormalizedTimezoneDate(selectedDate));
    const daysOfMonth = getDaysInMonthlyPeriodicity({
      chosenDate,
      eventStart,
      eventEnd,
    }) as Date[];

    return getEventsArrayFromDates({
      dates: daysOfMonth,
      commonProps,
      startTime,
      endTime,
      isCrossDayEvent,
    });
  }

  return [];
};

export const getDaysInMonthlyPeriodicity = ({
  chosenDate,
  eventEnd,
  eventStart,
}: GetDaysInMonthlyPeriodicity) => {
  const endDate = getDate(eventEnd);
  const end =
    chosenDate <= endDate ? eventEnd : new Date(eventEnd.getFullYear(), eventEnd.getMonth(), 0);
  const monthsBetween =
    end && eventStart && end > eventStart
      ? eachMonthOfInterval({
          start: eventStart,
          end,
        })
      : [];

  return monthsBetween.map((month) => {
    const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const dayOfMonth = Math.min(chosenDate, lastDayOfMonth.getDate());

    return new Date(month.getFullYear(), month.getMonth(), dayOfMonth);
  });
};

export const getStartEndComparison = (startTime: string, endTime: string) => {
  const startDate = new Date(`2000-01-01T${startTime}:00`);
  const endDate = new Date(`2000-01-01T${endTime}:00`);

  return startDate < endDate;
};

export const getNextDayComparison = (startTime: string, endTime: string) =>
  !getStartEndComparison(startTime, endTime) && startTime !== endTime;

export const removeSecondsFromTime = (time?: string | null) => {
  if (!time || !timeRegex.test(time)) return null;
  const [hours, minutes] = time.split(':');

  return `${hours}:${minutes}`;
};

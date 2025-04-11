/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { addDays, endOfYear, setHours, setMinutes, setSeconds } from 'date-fns';

import { Periodicity, TimerType } from 'modules/Dashboard/api';
import { formatToYearMonthDate, parseDateToMidnightLocal } from 'shared/utils/dateFormat';

import {
  createEvents,
  getDateFromDateStringTimeString,
  getDateFromDateTimeString,
  getDaysInMonthlyPeriodicity,
  getEndOfYearDateTime,
  getEventEndDateTime,
  getEventsArrayFromDates,
  getEventStartDateTime,
  getEventsWithHiddenInTimeView,
  getNextDayComparison,
  getNotHiddenEvents,
  getPreparedEvents,
  getStartEndComparison,
  getStartOfYearDateTime,
  removeSecondsFromTime,
} from './CalendarEvents.utils';

describe('getNextDayComparison', () => {
  test.each`
    startTime  | endTime    | expected
    ${'14:00'} | ${'05:00'} | ${true}
    ${'00:00'} | ${'23:59'} | ${false}
    ${'12:00'} | ${'12:00'} | ${false}
  `(
    'startTime=$startTime, endTime=$endTime, expected=$expected:',
    ({ startTime, endTime, expected }) => {
      expect(getNextDayComparison(startTime, endTime)).toBe(expected);
    },
  );
});

describe('getStartEndComparison', () => {
  test.each`
    startTime  | endTime    | expected
    ${'14:00'} | ${'05:00'} | ${false}
    ${'00:00'} | ${'23:59'} | ${true}
    ${'12:00'} | ${'12:00'} | ${false}
  `(
    'startTime=$startTime, endTime=$endTime, expected=$expected:',
    ({ startTime, endTime, expected }) => {
      expect(getStartEndComparison(startTime, endTime)).toBe(expected);
    },
  );
});

describe('getPreparedEvents: should', () => {
  const events = [
    { id: 1, alwaysAvailable: true },
    { id: 2, alwaysAvailable: false },
  ];
  const expected1 = [
    { id: 1, alwaysAvailable: true, isHidden: true },
    { id: 2, alwaysAvailable: false, isHidden: false },
  ];
  const expected2 = [
    { id: 1, alwaysAvailable: true, isHidden: false },
    { id: 2, alwaysAvailable: false, isHidden: true },
  ];
  const expected3 = [
    { id: 1, alwaysAvailable: true, isHidden: false },
    { id: 2, alwaysAvailable: false, isHidden: false },
  ];

  test.each`
    isAlwaysAvailableHidden | isScheduledHidden | expected     | description
    ${true}                 | ${false}          | ${expected1} | ${'set isHidden to true if alwaysAvailable and isAlwaysAvailableHidden is true'}
    ${false}                | ${true}           | ${expected2} | ${'set isHidden to true if !alwaysAvailable and isScheduledHidden is true'}
    ${false}                | ${false}          | ${expected3} | ${'not change isHidden if neither condition is met'}
  `(
    '$description; isAlwaysAvailableHidden=$isAlwaysAvailableHidden, isScheduledHidden=$isScheduledHidden',
    ({ isAlwaysAvailableHidden, isScheduledHidden, expected }) => {
      expect(getPreparedEvents(events, isAlwaysAvailableHidden, isScheduledHidden)).toEqual(
        expected,
      );
    },
  );
});

describe('getNotHiddenEvents: should return', () => {
  const hiddenEvents = [
    { id: 1, isHidden: true },
    { id: 2, isHidden: true },
  ];
  const visibleEvents = [
    { id: 3, isHidden: false },
    { id: 4, isHidden: false },
  ];
  const events1 = [...hiddenEvents, ...visibleEvents];

  test.each`
    events           | expected         | description
    ${events1}       | ${visibleEvents} | ${'only visible events when there are hidden and visible events'}
    ${hiddenEvents}  | ${[]}            | ${'an empty array when all events are hidden'}
    ${visibleEvents} | ${visibleEvents} | ${'the same array when all events are visible'}
    ${[]}            | ${[]}            | ${'an empty array when input array is empty'}
  `('$description', ({ events, expected }) => {
    expect(getNotHiddenEvents(events)).toEqual(expected);
  });
});

describe('getEventsWithHiddenInTimeView', () => {
  const mockedEvents = [
    { id: 1, start: new Date('2023-11-12'), allDay: true, alwaysAvailable: true },
    { id: 2, start: new Date('2023-11-12'), allDay: true, alwaysAvailable: false },
    { id: 3, start: new Date('2023-11-15'), allDay: false, alwaysAvailable: false },
    { id: 4, start: new Date('2023-11-12'), allDay: true, alwaysAvailable: false },
    { id: 5, start: new Date('2023-11-12'), allDay: false, alwaysAvailable: true },
    { id: 6, start: new Date('2023-11-12'), allDay: false, alwaysAvailable: true },
    { id: 7, start: new Date('2023-11-12'), allDay: false, alwaysAvailable: true },
    { id: 8, start: new Date('2023-11-12'), allDay: false, alwaysAvailable: true },
    { id: 9, start: new Date('2023-11-12'), allDay: true, alwaysAvailable: false },
    { id: 10, start: new Date('2023-11-12'), allDay: false, alwaysAvailable: true },
  ];

  test('should return the correct result', () => {
    const result = getEventsWithHiddenInTimeView(mockedEvents);
    expect(result).toHaveProperty('eventsToShow');
    expect(result).toHaveProperty('allDayEventsSortedByDays');
    expect(result).toHaveProperty('hiddenEventsIds');

    expect(result).toEqual({
      eventsToShow: [
        {
          id: 1,
          start: new Date('2023-11-12'),
          allDay: true,
          alwaysAvailable: true,
          isHiddenInTimeView: false,
        },
        {
          id: 2,
          start: new Date('2023-11-12'),
          allDay: true,
          alwaysAvailable: false,
          isHiddenInTimeView: false,
        },
        {
          id: 3,
          start: new Date('2023-11-15'),
          allDay: false,
          alwaysAvailable: false,
          isHiddenInTimeView: false,
        },
        {
          id: 4,
          start: new Date('2023-11-12'),
          allDay: true,
          alwaysAvailable: false,
          isHiddenInTimeView: false,
        },
        {
          id: 5,
          start: new Date('2023-11-12'),
          allDay: false,
          alwaysAvailable: true,
          isHiddenInTimeView: true,
        },
        {
          id: 6,
          start: new Date('2023-11-12'),
          allDay: false,
          alwaysAvailable: true,
          isHiddenInTimeView: true,
        },
        {
          id: 7,
          start: new Date('2023-11-12'),
          allDay: false,
          alwaysAvailable: true,
          isHiddenInTimeView: true,
        },
        {
          id: 8,
          start: new Date('2023-11-12'),
          allDay: false,
          alwaysAvailable: true,
          isHiddenInTimeView: true,
        },
        {
          id: 9,
          start: new Date('2023-11-12'),
          allDay: true,
          alwaysAvailable: false,
          isHiddenInTimeView: true,
        },
        {
          id: 10,
          start: new Date('2023-11-12'),
          allDay: false,
          alwaysAvailable: true,
          isHiddenInTimeView: true,
        },
      ],
      allDayEventsSortedByDays: [
        {
          eventsIds: [
            {
              id: 1,
              isHiddenInTimeView: false,
            },
            {
              id: 2,
              isHiddenInTimeView: false,
            },
            {
              id: 4,
              isHiddenInTimeView: false,
            },
            {
              id: 5,
              isHiddenInTimeView: true,
            },
            {
              id: 6,
              isHiddenInTimeView: true,
            },
            {
              id: 7,
              isHiddenInTimeView: true,
            },
            {
              id: 8,
              isHiddenInTimeView: true,
            },
            {
              id: 9,
              isHiddenInTimeView: true,
            },
            {
              id: 10,
              isHiddenInTimeView: true,
            },
          ],
          week: '45 2023',
          date: '12 Nov 2023',
        },
      ],
      hiddenEventsIds: [5, 6, 7, 8, 9, 10],
    });
  });
});

describe('getStartOfYearDateTime', () => {
  test('should return the start of the year for a given year', () => {
    const year = 2024;
    expect(getStartOfYearDateTime(year)).toEqual(new Date(year, 0, 1));
  });
});

describe('getEndOfYearDateTime', () => {
  test('should return the end of the year for a given year', () => {
    const year = 2023;
    expect(getEndOfYearDateTime(year)).toEqual(endOfYear(new Date(year, 0, 1)));
  });
});

describe('getDateFromDateTimeString: should return', () => {
  const date = new Date('2023-12-05T00:00:00');
  const expected1 = setSeconds(setMinutes(setHours(date, 12), 30), 45);

  test.each`
    date    | time          | expected     | description
    ${date} | ${'12:30:45'} | ${expected1} | ${'the correct date object for valid input'}
    ${date} | ${'1245'}     | ${date}      | ${'date for invalid time input'}
  `('$description; date=$date, time=$time', ({ date, time, expected }) => {
    expect(getDateFromDateTimeString(date, time)).toEqual(expected);
  });
});

describe('getDateFromDateStringTimeString: should return', () => {
  test.each`
    date            | time       | expected                           | description
    ${null}         | ${'05:00'} | ${null}                            | ${'null if date is not provided'}
    ${'2023-12-05'} | ${'12:00'} | ${new Date('2023-12-05T12:00:00')} | ${'the correct date object for valid input'}
  `('$description; date=$date, time=$time', ({ date, time, expected }) => {
    expect(getDateFromDateStringTimeString({ date, time })).toEqual(expected);
  });
});

describe('getEventStartDateTime', () => {
  const dateString = '2023-12-15';
  const nextYearDateString = '2024-01-01';
  const nextYearDateString2 = '2024-05-01';
  const startTime = '04:30:00';

  test.each`
    periodicity             | selectedDate           | startDate     | startTime    | nextYearDateString    | expected
    ${Periodicity.Always}   | ${dateString}          | ${null}       | ${null}      | ${null}               | ${new Date(`${dateString}T00:00:00`)}
    ${Periodicity.Always}   | ${dateString}          | ${null}       | ${startTime} | ${null}               | ${new Date(`${dateString}T00:00:00`)}
    ${Periodicity.Always}   | ${null}                | ${dateString} | ${null}      | ${null}               | ${null}
    ${Periodicity.Always}   | ${dateString}          | ${null}       | ${null}      | ${nextYearDateString} | ${new Date(`${nextYearDateString}T00:00:00`)}
    ${Periodicity.Always}   | ${nextYearDateString2} | ${null}       | ${null}      | ${nextYearDateString} | ${new Date(`${nextYearDateString2}T00:00:00`)}
    ${Periodicity.Once}     | ${dateString}          | ${null}       | ${startTime} | ${null}               | ${new Date(`${dateString}T${startTime}`)}
    ${Periodicity.Once}     | ${dateString}          | ${null}       | ${startTime} | ${nextYearDateString} | ${new Date(`${nextYearDateString}T${startTime}`)}
    ${Periodicity.Weekly}   | ${dateString}          | ${null}       | ${startTime} | ${null}               | ${new Date(`${dateString}T${startTime}`)}
    ${Periodicity.Monthly}  | ${dateString}          | ${null}       | ${startTime} | ${null}               | ${new Date(`${dateString}T${startTime}`)}
    ${Periodicity.Daily}    | ${null}                | ${dateString} | ${startTime} | ${null}               | ${new Date(`${dateString}T${startTime}`)}
    ${Periodicity.Daily}    | ${null}                | ${dateString} | ${startTime} | ${nextYearDateString} | ${new Date(`${nextYearDateString}T${startTime}`)}
    ${Periodicity.Weekdays} | ${null}                | ${dateString} | ${startTime} | ${null}               | ${new Date(`${dateString}T${startTime}`)}
  `(
    'periodicity=$periodicity, selectedDate=$selectedDate, startDate=$startDate, startTime=$startTime, nextYearDateString=$nextYearDateString, expected=$expected',
    ({ periodicity, selectedDate, startDate, startTime, nextYearDateString, expected }) => {
      expect(
        getEventStartDateTime({
          periodicity,
          selectedDate,
          startDate,
          startTime,
          nextYearDateString,
        }),
      ).toEqual(expected);
    },
  );
});

describe('getEventEndDateTime', () => {
  const dateString = '2023-12-15';
  const dateStringNextYear = '2024-07-15';
  const endTime = '16:30:00';
  const eventStart = parseDateToMidnightLocal(dateString);
  const eventStartNextYear = parseDateToMidnightLocal(dateStringNextYear);
  const eventStartWithTime = new Date(`${dateString}T${endTime}`);
  const currentYear = '2023';

  test.each`
    periodicity             | selectedDate  | endDate       | endTime    | currentYear    | eventStart            | isCrossDayEvent | expected
    ${Periodicity.Always}   | ${null}       | ${null}       | ${null}    | ${currentYear} | ${eventStart}         | ${false}        | ${getEndOfYearDateTime(currentYear)}
    ${Periodicity.Always}   | ${null}       | ${null}       | ${null}    | ${currentYear} | ${eventStartNextYear} | ${false}        | ${eventStartNextYear}
    ${Periodicity.Once}     | ${dateString} | ${null}       | ${endTime} | ${currentYear} | ${eventStartWithTime} | ${false}        | ${new Date(`${dateString}T${endTime}`)}
    ${Periodicity.Once}     | ${dateString} | ${null}       | ${endTime} | ${currentYear} | ${eventStartWithTime} | ${true}         | ${new Date(`${dateString}T23:59:00`)}
    ${Periodicity.Daily}    | ${null}       | ${dateString} | ${endTime} | ${currentYear} | ${eventStartWithTime} | ${false}        | ${new Date(`${dateString}T${endTime}`)}
    ${Periodicity.Daily}    | ${null}       | ${null}       | ${endTime} | ${currentYear} | ${eventStartWithTime} | ${false}        | ${getEndOfYearDateTime(currentYear)}
    ${Periodicity.Daily}    | ${null}       | ${null}       | ${endTime} | ${currentYear} | ${eventStartNextYear} | ${false}        | ${eventStartNextYear}
    ${Periodicity.Daily}    | ${null}       | ${dateString} | ${endTime} | ${currentYear} | ${eventStartWithTime} | ${true}         | ${new Date(`${dateString}T23:59:00`)}
    ${Periodicity.Weekly}   | ${null}       | ${dateString} | ${endTime} | ${currentYear} | ${eventStartWithTime} | ${false}        | ${new Date(`${dateString}T${endTime}`)}
    ${Periodicity.Weekly}   | ${null}       | ${null}       | ${endTime} | ${currentYear} | ${eventStartWithTime} | ${false}        | ${getEndOfYearDateTime(currentYear)}
    ${Periodicity.Weekly}   | ${null}       | ${null}       | ${endTime} | ${currentYear} | ${eventStartNextYear} | ${false}        | ${eventStartNextYear}
    ${Periodicity.Weekly}   | ${null}       | ${dateString} | ${endTime} | ${currentYear} | ${eventStartWithTime} | ${true}         | ${new Date(`${dateString}T23:59:00`)}
    ${Periodicity.Weekdays} | ${null}       | ${dateString} | ${endTime} | ${currentYear} | ${eventStartWithTime} | ${false}        | ${new Date(`${dateString}T${endTime}`)}
    ${Periodicity.Weekdays} | ${null}       | ${null}       | ${endTime} | ${currentYear} | ${eventStartWithTime} | ${false}        | ${getEndOfYearDateTime(currentYear)}
    ${Periodicity.Weekdays} | ${null}       | ${null}       | ${endTime} | ${currentYear} | ${eventStartNextYear} | ${false}        | ${eventStartNextYear}
    ${Periodicity.Weekdays} | ${null}       | ${dateString} | ${endTime} | ${currentYear} | ${eventStartWithTime} | ${true}         | ${new Date(`${dateString}T23:59:00`)}
    ${Periodicity.Monthly}  | ${null}       | ${dateString} | ${endTime} | ${currentYear} | ${eventStartWithTime} | ${false}        | ${new Date(`${dateString}T${endTime}`)}
    ${Periodicity.Monthly}  | ${null}       | ${null}       | ${endTime} | ${currentYear} | ${eventStartWithTime} | ${false}        | ${getEndOfYearDateTime(currentYear)}
    ${Periodicity.Monthly}  | ${null}       | ${null}       | ${endTime} | ${currentYear} | ${eventStartNextYear} | ${false}        | ${eventStartNextYear}
    ${Periodicity.Monthly}  | ${null}       | ${dateString} | ${endTime} | ${currentYear} | ${eventStartWithTime} | ${true}         | ${new Date(`${dateString}T23:59:00`)}
  `(
    'periodicity=$periodicity, selectedDate=$selectedDate, endDate=$endDate, endTime=$endTime, currentYear=$currentYear, eventStart=$eventStart, isCrossDayEvent=$isCrossDayEvent, expected=$expected',
    ({
      periodicity,
      selectedDate,
      endDate,
      endTime,
      currentYear,
      eventStart,
      isCrossDayEvent,
      expected,
    }) => {
      expect(
        getEventEndDateTime({
          periodicity,
          selectedDate,
          endDate,
          endTime,
          currentYear,
          eventStart,
          isCrossDayEvent,
        }),
      ).toEqual(expected);
    },
  );
});

describe('getEventsArrayFromDates', () => {
  const DEFAULT_START_TIME = '00:00:00';
  const DEFAULT_END_TIME = '23:59:00';
  const dates = [new Date('2023-12-06'), new Date('2023-12-12')];
  const props = { title: 'Event 1' };
  const startTime = '10:00:00';
  const endTime = '12:00:00';
  const expected1 = [
    {
      ...props,
      id: expect.any(String),
      start: getDateFromDateTimeString(dates[0], startTime),
      end: getDateFromDateTimeString(dates[0], endTime),
      eventCurrentDate: formatToYearMonthDate(dates[0]),
    },
    {
      ...props,
      id: expect.any(String),
      start: getDateFromDateTimeString(dates[1], startTime),
      end: getDateFromDateTimeString(dates[1], endTime),
      eventCurrentDate: formatToYearMonthDate(dates[1]),
    },
  ];
  const expected2 = [
    {
      ...props,
      id: expect.any(String),
      start: getDateFromDateTimeString(dates[0], startTime),
      end: getDateFromDateTimeString(dates[0], DEFAULT_END_TIME),
      eventCurrentDate: formatToYearMonthDate(dates[0]),
      eventSpanAfter: true,
    },
    {
      ...props,
      id: expect.any(String),
      start: getDateFromDateTimeString(addDays(dates[0], 1), DEFAULT_START_TIME),
      end: getDateFromDateTimeString(addDays(dates[0], 1), endTime),
      eventCurrentDate: formatToYearMonthDate(addDays(dates[0], 1)),
      eventSpanBefore: true,
    },
    {
      ...props,
      id: expect.any(String),
      start: getDateFromDateTimeString(dates[1], startTime),
      end: getDateFromDateTimeString(dates[1], DEFAULT_END_TIME),
      eventCurrentDate: formatToYearMonthDate(dates[1]),
      eventSpanAfter: true,
    },
    {
      ...props,
      id: expect.any(String),
      start: getDateFromDateTimeString(addDays(dates[1], 1), DEFAULT_START_TIME),
      end: getDateFromDateTimeString(addDays(dates[1], 1), endTime),
      eventCurrentDate: formatToYearMonthDate(addDays(dates[1], 1)),
      eventSpanBefore: true,
    },
  ];
  const desc1 = 'returns an array with two events from two dates for a non-cross-day event';
  const desc2 = 'returns an array with four events from two for a cross-day event';
  const desc3 = 'returns an empty array for empty dates array';

  test.each`
    dates    | commonProps | startTime    | endTime    | isCrossDayEvent | expected     | description
    ${dates} | ${props}    | ${startTime} | ${endTime} | ${false}        | ${expected1} | ${desc1}
    ${dates} | ${props}    | ${startTime} | ${endTime} | ${true}         | ${expected2} | ${desc2}
    ${[]}    | ${props}    | ${startTime} | ${endTime} | ${false}        | ${[]}        | ${desc3}
  `('$description', ({ dates, commonProps, startTime, endTime, isCrossDayEvent, expected }) => {
    const result = getEventsArrayFromDates({
      dates,
      commonProps,
      startTime,
      endTime,
      isCrossDayEvent,
    });

    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expected);
  });
});

describe('createEvents', () => {
  const defaultStartDate = '2023-12-06';
  const defaultEndDate = '2023-12-07';
  const startTime = '09:25:00';
  const endTime = '22:30:00';
  const props1 = {
    activityOrFlowId: '123',
    eventId: '1234',
    activityOrFlowName: 'some name',
    periodicityType: Periodicity.Once,
    selectedDate: defaultStartDate,
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    startTime,
    endTime,
    isAlwaysAvailable: false,
    colors: ['red', 'blue'],
    flowId: 'flow-555',
    currentYear: 2023,
    oneTimeCompletion: false,
    accessBeforeSchedule: true,
    timerType: TimerType.Timer,
    timer: 60,
    notification: null,
  };
  const commonExpectedProps = {
    activityOrFlowId: '123',
    eventId: '1234',
    title: 'some name',
    alwaysAvailable: false,
    startFlowIcon: true,
    isHidden: false,
    backgroundColor: 'transparent',
    oneTimeCompletion: false,
    accessBeforeSchedule: true,
    timerType: 'TIMER',
    timer: 60,
    notification: null,
    endAlertIcon: false,
    allDay: false,
    scheduledColor: 'red',
    scheduledBackground: 'blue',
    id: expect.any(String),
  };
  const expected1 = [
    {
      ...commonExpectedProps,
      periodicity: 'ONCE',
      eventStart: new Date('2023-12-06T09:25:00'),
      eventEnd: new Date('2023-12-06T22:30:00'),
      oneTimeCompletion: false,
      startTime: '09:25',
      endTime: '22:30',
      start: new Date('2023-12-06T09:25:00'),
      end: new Date('2023-12-06T22:30:00'),
      eventCurrentDate: '06 Dec 2023',
    },
  ];
  const props2 = {
    ...props1,
    periodicityType: Periodicity.Daily,
  };
  const expected2 = [
    {
      ...commonExpectedProps,
      periodicity: 'DAILY',
      eventStart: new Date('2023-12-06T09:25:00'),
      eventEnd: new Date('2023-12-07T22:30:00'),
      startTime: '09:25',
      endTime: '22:30',
      start: new Date('2023-12-06T09:25:00'),
      end: new Date('2023-12-06T22:30:00'),
      eventCurrentDate: '06 Dec 2023',
    },
    {
      ...commonExpectedProps,
      periodicity: 'DAILY',
      eventStart: new Date('2023-12-06T09:25:00'),
      eventEnd: new Date('2023-12-07T22:30:00'),
      startTime: '09:25',
      endTime: '22:30',
      start: new Date('2023-12-07T09:25:00'),
      end: new Date('2023-12-07T22:30:00'),
      eventCurrentDate: '07 Dec 2023',
    },
  ];
  const props3 = {
    ...props1,
    periodicityType: Periodicity.Weekly,
    endDate: '2023-12-20',
  };
  const expected3 = [
    {
      ...commonExpectedProps,
      periodicity: 'WEEKLY',
      eventStart: new Date('2023-12-06T09:25:00'),
      eventEnd: new Date('2023-12-20T22:30:00'),
      startTime: '09:25',
      endTime: '22:30',
      start: new Date('2023-12-06T09:25:00'),
      end: new Date('2023-12-06T22:30:00'),
      eventCurrentDate: '06 Dec 2023',
    },
    {
      ...commonExpectedProps,
      periodicity: 'WEEKLY',
      eventStart: new Date('2023-12-06T09:25:00'),
      eventEnd: new Date('2023-12-20T22:30:00'),
      startTime: '09:25',
      endTime: '22:30',
      start: new Date('2023-12-13T09:25:00'),
      end: new Date('2023-12-13T22:30:00'),
      eventCurrentDate: '13 Dec 2023',
    },
    {
      ...commonExpectedProps,
      periodicity: 'WEEKLY',
      eventStart: new Date('2023-12-06T09:25:00'),
      eventEnd: new Date('2023-12-20T22:30:00'),
      startTime: '09:25',
      endTime: '22:30',
      start: new Date('2023-12-20T09:25:00'),
      end: new Date('2023-12-20T22:30:00'),
      eventCurrentDate: '20 Dec 2023',
    },
  ];
  const props4 = {
    ...props1,
    periodicityType: Periodicity.Weekdays,
    startDate: '2023-12-08',
    endDate: '2023-12-11',
  };
  const expected4 = [
    {
      ...commonExpectedProps,
      periodicity: 'WEEKDAYS',
      eventStart: new Date('2023-12-08T09:25:00'),
      eventEnd: new Date('2023-12-11T22:30:00'),
      startTime: '09:25',
      endTime: '22:30',
      start: new Date('2023-12-08T09:25:00'),
      end: new Date('2023-12-08T22:30:00'),
      eventCurrentDate: '08 Dec 2023',
    },
    {
      ...commonExpectedProps,
      periodicity: 'WEEKDAYS',
      eventStart: new Date('2023-12-08T09:25:00'),
      eventEnd: new Date('2023-12-11T22:30:00'),
      startTime: '09:25',
      endTime: '22:30',
      start: new Date('2023-12-11T09:25:00'),
      end: new Date('2023-12-11T22:30:00'),
      eventCurrentDate: '11 Dec 2023',
    },
  ];
  const props5 = {
    ...props1,
    periodicityType: Periodicity.Monthly,
    startDate: '2023-12-08',
    endDate: '2024-01-25',
  };
  const expected5 = [
    {
      ...commonExpectedProps,
      periodicity: 'MONTHLY',
      eventStart: new Date('2023-12-08T09:25:00'),
      eventEnd: new Date('2024-01-25T22:30:00'),
      startTime: '09:25',
      endTime: '22:30',
      start: new Date('2023-12-06T09:25:00'),
      end: new Date('2023-12-06T22:30:00'),
      eventCurrentDate: '06 Dec 2023',
    },
    {
      ...commonExpectedProps,
      periodicity: 'MONTHLY',
      eventStart: new Date('2023-12-08T09:25:00'),
      eventEnd: new Date('2024-01-25T22:30:00'),
      startTime: '09:25',
      endTime: '22:30',
      start: new Date('2024-01-06T09:25:00'),
      end: new Date('2024-01-06T22:30:00'),
      eventCurrentDate: '06 Jan 2024',
    },
  ];
  const props6 = {
    ...props1,
    isAlwaysAvailable: true,
    periodicityType: Periodicity.Always,
    startDate: '2023-12-29',
    selectedDate: '2023-12-29',
    startTime: '00:00:00',
    endTime: '23:59:00',
  };
  const expected6 = [
    {
      ...commonExpectedProps,
      alwaysAvailable: true,
      backgroundColor: 'red',
      periodicity: 'ALWAYS',
      eventStart: new Date('2023-12-29T00:00:00'),
      eventEnd: getEndOfYearDateTime(2023),
      allDay: true,
      scheduledColor: undefined,
      scheduledBackground: undefined,
      startTime: '00:00',
      endTime: '23:59',
      start: new Date('2023-12-29T00:00:00'),
      end: new Date('2023-12-29T23:59:00'),
      eventCurrentDate: '29 Dec 2023',
    },
    {
      ...commonExpectedProps,
      alwaysAvailable: true,
      backgroundColor: 'red',
      periodicity: 'ALWAYS',
      eventStart: new Date('2023-12-29T00:00:00'),
      eventEnd: getEndOfYearDateTime(2023),
      allDay: true,
      scheduledColor: undefined,
      scheduledBackground: undefined,
      startTime: '00:00',
      endTime: '23:59',
      start: new Date('2023-12-30T00:00:00'),
      end: new Date('2023-12-30T23:59:00'),
      eventCurrentDate: '30 Dec 2023',
    },
    {
      ...commonExpectedProps,
      alwaysAvailable: true,
      backgroundColor: 'red',
      periodicity: 'ALWAYS',
      eventStart: new Date('2023-12-29T00:00:00'),
      eventEnd: getEndOfYearDateTime(2023),
      allDay: true,
      scheduledColor: undefined,
      scheduledBackground: undefined,
      startTime: '00:00',
      endTime: '23:59',
      start: new Date('2023-12-31T00:00:00'),
      end: new Date('2023-12-31T23:59:00'),
      eventCurrentDate: '31 Dec 2023',
    },
  ];
  const props7 = {
    ...props1,
    startDate: '2023-12-29',
    selectedDate: '2023-12-29',
    startTime: '15:00:00',
    endTime: '12:35:00',
  };
  const expected7 = [
    {
      ...commonExpectedProps,
      periodicity: 'ONCE',
      eventStart: new Date('2023-12-29T15:00:00'),
      eventEnd: new Date('2023-12-29T23:59:00'),
      startTime: '15:00',
      endTime: '12:35',
      start: new Date('2023-12-29T15:00:00'),
      end: new Date('2023-12-29T23:59:00'),
      eventCurrentDate: '29 Dec 2023',
      eventSpanAfter: true,
    },
    {
      ...commonExpectedProps,
      periodicity: 'ONCE',
      eventStart: new Date('2023-12-29T15:00:00'),
      eventEnd: new Date('2023-12-29T23:59:00'),
      startTime: '15:00',
      endTime: '12:35',
      start: new Date('2023-12-30T00:00:00'),
      end: new Date('2023-12-30T12:35:00'),
      eventCurrentDate: '30 Dec 2023',
      eventSpanBefore: true,
    },
  ];
  const props8 = {
    ...props1,
    periodicityType: Periodicity.Monthly,
    startDate: '2023-12-15',
    selectedDate: '2023-12-15',
    endDate: '2024-01-30',
    startTime: '15:00:00',
    endTime: '12:35:00',
  };
  const expected8 = [
    {
      ...commonExpectedProps,
      periodicity: 'MONTHLY',
      eventStart: new Date('2023-12-15T15:00:00'),
      eventEnd: new Date('2024-01-30T23:59:00'),
      startTime: '15:00',
      endTime: '12:35',
      start: new Date('2023-12-15T15:00:00'),
      end: new Date('2023-12-15T23:59:00'),
      eventCurrentDate: '15 Dec 2023',
      eventSpanAfter: true,
    },
    {
      ...commonExpectedProps,
      periodicity: 'MONTHLY',
      eventStart: new Date('2023-12-15T15:00:00'),
      eventEnd: new Date('2024-01-30T23:59:00'),
      startTime: '15:00',
      endTime: '12:35',
      start: new Date('2023-12-16T00:00:00'),
      end: new Date('2023-12-16T12:35:00'),
      eventCurrentDate: '16 Dec 2023',
      eventSpanBefore: true,
    },
    {
      ...commonExpectedProps,
      periodicity: 'MONTHLY',
      eventStart: new Date('2023-12-15T15:00:00'),
      eventEnd: new Date('2024-01-30T23:59:00'),
      startTime: '15:00',
      endTime: '12:35',
      start: new Date('2024-01-15T15:00:00'),
      end: new Date('2024-01-15T23:59:00'),
      eventCurrentDate: '15 Jan 2024',
      eventSpanAfter: true,
    },
    {
      ...commonExpectedProps,
      periodicity: 'MONTHLY',
      eventStart: new Date('2023-12-15T15:00:00'),
      eventEnd: new Date('2024-01-30T23:59:00'),
      startTime: '15:00',
      endTime: '12:35',
      start: new Date('2024-01-16T00:00:00'),
      end: new Date('2024-01-16T12:35:00'),
      eventCurrentDate: '16 Jan 2024',
      eventSpanBefore: true,
    },
  ];

  const descOnce = 'returns correct events for Once periodicity';
  const descDaily = 'returns correct events for Daily periodicity';
  const descWeekly = 'returns correct events for Weekly periodicity';
  const descWeekdays = 'returns correct events for Weekdays periodicity';
  const descMonthly = 'returns correct events for Monthly periodicity';
  const descAlways = 'returns correct events for Always periodicity';
  const descOnceCrossDay = 'returns correct events for Once periodicity cross-day events';
  const descMonthlyCrossDay = 'returns correct events for Monthly periodicity cross-day events';

  test.each`
    props     | expected     | description
    ${props1} | ${expected1} | ${descOnce}
    ${props2} | ${expected2} | ${descDaily}
    ${props3} | ${expected3} | ${descWeekly}
    ${props4} | ${expected4} | ${descWeekdays}
    ${props5} | ${expected5} | ${descMonthly}
    ${props6} | ${expected6} | ${descAlways}
    ${props7} | ${expected7} | ${descOnceCrossDay}
    ${props8} | ${expected8} | ${descMonthlyCrossDay}
  `('$description', ({ props, expected }) => {
    const result = createEvents({
      ...props,
    });

    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expected);
  });
});

describe('getDaysInMonthlyPeriodicity', () => {
  const eventStart1 = new Date('2023-01-15T00:00:00.000Z');
  const eventEnd1 = new Date('2023-03-31T23:59:59.999Z');
  const eventStart2 = new Date('2023-01-25T00:00:00.000Z');
  const eventEnd2 = new Date('2023-03-20T23:59:59.999Z');
  const eventStart3 = new Date('2023-04-15T00:00:00.000Z');
  const eventEnd3 = new Date('2023-03-31T23:59:59.999Z');
  test.each`
    chosenDate | eventStart     | eventEnd     | expected
    ${15}      | ${eventStart1} | ${eventEnd1} | ${3}
    ${25}      | ${eventStart2} | ${eventEnd2} | ${2}
    ${15}      | ${eventStart3} | ${eventEnd3} | ${0}
  `(
    'chosenDate=$chosenDate, eventStart=$eventStart, eventEnd=$eventEnd, expected=$expected',
    ({ chosenDate, eventStart, eventEnd, expected }) => {
      expect(getDaysInMonthlyPeriodicity({ chosenDate, eventStart, eventEnd })).toHaveLength(
        expected,
      );
    },
  );
});

describe('removeSecondsFromTime', () => {
  test.each`
    time                   | expected
    ${'12:34:56'}          | ${'12:34'}
    ${null}                | ${null}
    ${undefined}           | ${null}
    ${'invalidTimeFormat'} | ${null}
  `('time=$time, expected=$expected:', ({ time, expected }) => {
    expect(removeSecondsFromTime(time)).toBe(expected);
  });
});

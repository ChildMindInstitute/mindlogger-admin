/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { endOfYear } from 'date-fns';

import { NotificationType, Periodicity, TimerType } from 'modules/Dashboard/api';
import { DEFAULT_END_TIME, DEFAULT_START_TIME } from 'shared/consts';

import {
  getBetweenStartEndNextDayComparison,
  getBetweenStartEndNextDaySingleComparison,
  startEndTimeTest,
  notificationValidPeriodTest,
  timerDurationTest,
  createTimeEntity,
  convertSecondsToHHmmString,
  getActivityOrFlowId,
  getStartEndDates,
  getDefaultValues,
  getNotifications,
  getReminder,
  activityAvailabilityAtDayTest,
  reminderTimeTest,
  getTimer,
} from './EventForm.utils';
import { DEFAULT_IDLE_TIME, DEFAULT_TIMER_DURATION } from './EventForm.const';
import { SecondsManipulation } from './EventForm.types';

const mockedEvent = {
  id: '12',
  activityOrFlowId: '123',
  eventId: '123456',
  title: 'test title',
  start: new Date('2023-11-12'),
  end: new Date('2023-11-29'),
  backgroundColor: '#fff',
  alwaysAvailable: false,
  isHidden: false,
  periodicity: Periodicity.Once,
  eventStart: new Date('2023-11-12'),
  eventEnd: new Date('2023-11-29'),
  startTime: '01:00',
  endTime: '23:00',
};

describe('getTimer', () => {
  test.each([
    [TimerType.Timer, '07:00', '00:01', '07:00:00'],
    [TimerType.Idle, '00:00', '00:05', '00:05:00'],
    ['InvalidTimerType', '00:00', '00:00', undefined],
    [TimerType.Timer, undefined, undefined, undefined],
  ])(
    'returns correct timer duration for type "%s"',
    (timerType, timerDuration, idleTime, expected) => {
      const result = getTimer(timerType, timerDuration, idleTime);
      expect(result).toBe(expected);
    },
  );
});

describe('EventForm.utils', () => {
  describe('startEndTimeTest: should return', () => {
    const testContext1 = {
      parent: {
        startTime: '',
        endTime: '23:59',
      },
    };
    const testContext2 = {
      parent: {
        startTime: '10:00',
        endTime: '10:00',
      },
    };
    const testContext3 = {
      parent: {
        startTime: '10:00',
        endTime: '09:00',
      },
    };
    test.each`
      testContext     | expected | description
      ${testContext1} | ${false} | ${'false when either startTime or endTime is empty'}
      ${testContext2} | ${false} | ${'false when startTime and endTime are equal'}
      ${testContext3} | ${true}  | ${'true when startTime and endTime are different'}
    `('$description', ({ testContext, expected }) => {
      expect(startEndTimeTest(undefined, testContext)).toBe(expected);
    });
  });

  describe('timerDurationTest: should return', () => {
    test.each`
      value        | expected | description
      ${''}        | ${false} | ${'false when value is empty string'}
      ${undefined} | ${false} | ${'false when value is undefined'}
      ${'01:59'}   | ${true}  | ${'true when value is correct HH:mm'}
    `('$description', ({ value, expected }) => {
      expect(timerDurationTest(value)).toBe(expected);
    });
  });

  describe('createTimeEntity: should', () => {
    test.each`
      value | expected | description
      ${5}  | ${'05'}  | ${'pad a single-digit number with a leading zero'}
      ${25} | ${'25'}  | ${'not pad a double-digit number'}
    `('$description', ({ value, expected }) => {
      expect(createTimeEntity(value)).toBe(expected);
    });
  });

  describe('convertSecondsToHHmmString: should', () => {
    test.each`
      value    | expected   | description
      ${3660}  | ${'01:01'} | ${'convert seconds to HH:mm format'}
      ${0}     | ${'00:00'} | ${'handle zero seconds'}
      ${80000} | ${'22:13'} | ${'handle large number of seconds'}
    `('$description', ({ value, expected }) => {
      expect(convertSecondsToHHmmString(value)).toBe(expected);
    });
    test('not handle durations greater than 24 hours', () => {
      const result = convertSecondsToHHmmString(1000000);
      expect(result).not.toBe('277:46');
    });
  });

  describe('getActivityOrFlowId: should return', () => {
    const id = '123';
    test.each`
      editedEvent    | flowIcon | id    | expected        | description
      ${undefined}   | ${true}  | ${id} | ${''}           | ${'an empty string when editedEvent is undefined'}
      ${mockedEvent} | ${false} | ${id} | ${id}           | ${'the eventActivityOrFlowId when startFlowIcon is false'}
      ${mockedEvent} | ${true}  | ${id} | ${`flow-${id}`} | ${'"flow-eventActivityOrFlowId" when startFlowIcon is true'}
    `('$description', ({ editedEvent, flowIcon, id, expected }) => {
      expect(getActivityOrFlowId(editedEvent, flowIcon, id)).toBe(expected);
    });
  });

  describe('getStartEndDates: should return', () => {
    const defaultStartDate = new Date('2023-01-01');
    const expected1 = {
      startDate: defaultStartDate,
      endDate: endOfYear(defaultStartDate),
    };
    const expected2 = {
      startDate: mockedEvent.start,
      endDate: mockedEvent.end,
    };
    const expected3 = {
      startDate: mockedEvent.start,
      endDate: null,
    };
    const expected4 = {
      startDate: mockedEvent.start,
      endDate: endOfYear(mockedEvent.start),
    };
    const expected5 = {
      startDate: defaultStartDate,
      endDate: mockedEvent.end,
    };

    test.each`
      isOnce   | isAlways | defaultStartDate    | eventStart           | eventEnd           | editedEvent    | expected     | description
      ${true}  | ${false} | ${defaultStartDate} | ${undefined}         | ${undefined}       | ${undefined}   | ${expected1} | ${'default start and end dates for periodicity once'}
      ${false} | ${true}  | ${defaultStartDate} | ${undefined}         | ${undefined}       | ${undefined}   | ${expected1} | ${'default start and end dates for periodicity always'}
      ${false} | ${false} | ${defaultStartDate} | ${mockedEvent.start} | ${mockedEvent.end} | ${undefined}   | ${expected2} | ${'event start and end dates if not periodicity once or always'}
      ${false} | ${false} | ${defaultStartDate} | ${mockedEvent.start} | ${null}            | ${mockedEvent} | ${expected3} | ${'event start and end date equal to null if edited event is defined and event end is null'}
      ${false} | ${false} | ${defaultStartDate} | ${mockedEvent.start} | ${null}            | ${undefined}   | ${expected4} | ${'event start and computed end date if edited event is undefined and event end is null'}
      ${false} | ${false} | ${defaultStartDate} | ${undefined}         | ${mockedEvent.end} | ${mockedEvent} | ${expected5} | ${'default start date if event start is not provided'}
    `(
      '$description',
      ({ isOnce, isAlways, defaultStartDate, eventStart, eventEnd, editedEvent, expected }) => {
        expect(
          getStartEndDates(isOnce, isAlways, defaultStartDate, eventStart, eventEnd, editedEvent),
        ).toEqual(expected);
      },
    );
  });

  describe('getDefaultValues', () => {
    const defaultStartDate = new Date('2023-11-12');
    test('returns default values when editedEvent is undefined', () => {
      expect(getDefaultValues(defaultStartDate)).toEqual({
        activityOrFlowId: '',
        alwaysAvailable: true,
        oneTimeCompletion: false,
        startTime: DEFAULT_START_TIME,
        endTime: DEFAULT_END_TIME,
        date: defaultStartDate,
        startDate: defaultStartDate,
        endDate: endOfYear(defaultStartDate),
        accessBeforeSchedule: false,
        timerType: TimerType.NotSet,
        timerDuration: DEFAULT_TIMER_DURATION,
        idleTime: DEFAULT_IDLE_TIME,
        periodicity: Periodicity.Always,
        notifications: [],
        reminder: null,
      });
    });

    test('returns correct values when editedEvent is provided', () => {
      const editedEvent = {
        ...mockedEvent,
        startFlowIcon: true,
        oneTimeCompletion: false,
        accessBeforeSchedule: true,
        timerType: TimerType.Timer,
        timer: 120,
        notification: {
          notifications: [
            {
              fromTime: '05:00',
              toTime: '20:00',
              triggerType: NotificationType.Random,
            },
            {
              atTime: '15:00',
              triggerType: NotificationType.Fixed,
            },
          ],
          reminder: {
            activityIncomplete: 0,
            reminderTime: '16:00',
          },
        },
      };

      expect(getDefaultValues(defaultStartDate, editedEvent)).toEqual({
        activityOrFlowId: `flow-${editedEvent.activityOrFlowId}`,
        alwaysAvailable: editedEvent.alwaysAvailable,
        oneTimeCompletion: editedEvent.oneTimeCompletion,
        startTime: editedEvent.startTime,
        endTime: editedEvent.endTime,
        date: editedEvent.eventStart,
        startDate: defaultStartDate,
        endDate: endOfYear(defaultStartDate),
        accessBeforeSchedule: editedEvent.accessBeforeSchedule,
        timerType: editedEvent.timerType,
        timerDuration: convertSecondsToHHmmString(editedEvent.timer),
        idleTime: DEFAULT_IDLE_TIME,
        periodicity: editedEvent.periodicity,
        notifications: getNotifications(
          SecondsManipulation.RemoveSeconds,
          editedEvent.notification.notifications,
        ),
        reminder: getReminder({
          type: SecondsManipulation.RemoveSeconds,
          reminder: editedEvent.notification.reminder,
        }),
      });
    });
  });

  describe('getBetweenStartEndNextDaySingleComparison', () => {
    test.each`
      time       | rangeStartTime | rangeEndTime | expected
      ${'00:00'} | ${'14:00'}     | ${'05:00'}   | ${true}
      ${'03:00'} | ${'14:00'}     | ${'05:00'}   | ${true}
      ${'16:00'} | ${'14:00'}     | ${'05:00'}   | ${true}
      ${'11:00'} | ${'14:00'}     | ${'05:00'}   | ${false}
      ${'07:00'} | ${'14:00'}     | ${'05:00'}   | ${false}
      ${'00:00'} | ${'14:00'}     | ${'14:00'}   | ${false}
      ${'14:00'} | ${'14:00'}     | ${'14:00'}   | ${true}
    `(
      'time=$time, rangeStart=$rangeStartTime, rangeStart=$rangeEndTime:',
      ({ time, rangeStartTime, rangeEndTime, expected }) => {
        expect(
          getBetweenStartEndNextDaySingleComparison({ time, rangeStartTime, rangeEndTime }),
        ).toBe(expected);
      },
    );
  });

  describe('getBetweenStartEndNextDayComparison', () => {
    test.each`
      time       | fromTime   | toTime     | rangeStartTime | rangeEndTime | expected
      ${'00:00'} | ${'00:00'} | ${'05:00'} | ${'14:00'}     | ${'05:00'}   | ${true}
      ${'03:00'} | ${'03:00'} | ${'05:00'} | ${'14:00'}     | ${'05:00'}   | ${true}
      ${'16:00'} | ${'16:00'} | ${'05:00'} | ${'14:00'}     | ${'05:00'}   | ${true}
      ${'14:00'} | ${'14:00'} | ${'05:00'} | ${'14:00'}     | ${'05:00'}   | ${true}
      ${'00:00'} | ${'14:00'} | ${'00:00'} | ${'14:00'}     | ${'05:00'}   | ${true}
      ${'03:00'} | ${'14:00'} | ${'03:00'} | ${'14:00'}     | ${'05:00'}   | ${true}
      ${'16:00'} | ${'14:00'} | ${'16:00'} | ${'14:00'}     | ${'05:00'}   | ${true}
      ${'14:00'} | ${'14:00'} | ${'14:00'} | ${'14:00'}     | ${'05:00'}   | ${true}
      ${'11:00'} | ${'14:00'} | ${'05:00'} | ${'14:00'}     | ${'05:00'}   | ${false}
      ${'11:00'} | ${'11:00'} | ${'16:00'} | ${'14:00'}     | ${'05:00'}   | ${false}
      ${'11:00'} | ${'11:00'} | ${'13:00'} | ${'14:00'}     | ${'05:00'}   | ${false}
      ${'03:00'} | ${'03:00'} | ${'07:00'} | ${'14:00'}     | ${'05:00'}   | ${true}
      ${'06:00'} | ${'06:00'} | ${'07:00'} | ${'14:00'}     | ${'05:00'}   | ${false}
      ${'16:00'} | ${'11:00'} | ${'16:00'} | ${'14:00'}     | ${'05:00'}   | ${true}
      ${'13:00'} | ${'11:00'} | ${'13:00'} | ${'14:00'}     | ${'05:00'}   | ${false}
      ${'07:00'} | ${'03:00'} | ${'07:00'} | ${'14:00'}     | ${'05:00'}   | ${false}
      ${'07:00'} | ${'06:00'} | ${'07:00'} | ${'14:00'}     | ${'05:00'}   | ${false}
      ${'05:00'} | ${'14:00'} | ${'05:00'} | ${'14:00'}     | ${'05:00'}   | ${true}
      ${'23:55'} | ${'00:00'} | ${'23:55'} | ${'23:55'}     | ${'00:00'}   | ${false}
    `(
      'time=$time, fromTime=$fromTime, toTime=$toTime, rangeStart=$rangeStartTime, rangeEnd=$rangeEndTime:',
      ({ time, fromTime, toTime, rangeStartTime, rangeEndTime, expected }) => {
        expect(
          getBetweenStartEndNextDayComparison({
            time,
            fromTime,
            toTime,
            rangeStartTime,
            rangeEndTime,
          }),
        ).toBe(expected);
      },
    );
  });

  describe('notificationValidPeriodTest', () => {
    const testContext = {
      parent: {
        fromTime: '14:00',
        toTime: '05:00',
      },
    };
    const testContextWithEmptyFromTime = {
      parent: {
        fromTime: null,
        toTime: '05:00',
      },
    };
    const testContextWithEmptyToTime = {
      parent: {
        fromTime: '14:00',
        toTime: null,
      },
    };
    const testContextWithEqualStartEndTime = {
      parent: {
        fromTime: '14:00',
        toTime: '14:00',
      },
    };
    test.each`
      field             | testContext                         | expected
      ${'fromTime'}     | ${testContext}                      | ${true}
      ${'toTime'}       | ${testContext}                      | ${true}
      ${'reminderTime'} | ${testContext}                      | ${true}
      ${'atTime'}       | ${testContext}                      | ${true}
      ${'reminderTime'} | ${testContextWithEmptyFromTime}     | ${true}
      ${'atTime'}       | ${testContextWithEmptyToTime}       | ${true}
      ${'fromTime'}     | ${testContextWithEmptyFromTime}     | ${true}
      ${'toTime'}       | ${testContextWithEmptyFromTime}     | ${true}
      ${'fromTime'}     | ${testContextWithEqualStartEndTime} | ${false}
      ${'toTime'}       | ${testContextWithEqualStartEndTime} | ${false}
      ${'reminderTime'} | ${testContextWithEqualStartEndTime} | ${true}
      ${'atTime'}       | ${testContextWithEqualStartEndTime} | ${true}
    `('field=$field, testContext=$testContext:', ({ field, testContext, expected }) => {
      const value = '00:00';
      expect(notificationValidPeriodTest(field)(value, testContext)).toBe(expected);
    });
  });

  const getReminderMockedTestContext = ({
    startDate = new Date('2023-11-12'),
    endDate = new Date('2023-12-31'),
    startTime = '05:00',
    endTime = '20:00',
    periodicity = Periodicity.Once,
    activityIncomplete = undefined,
  }) => ({
    parent: {
      activityIncomplete,
    },
    from: [
      {},
      {
        value: {
          startDate,
          endDate,
          startTime,
          endTime,
          periodicity,
        },
      },
    ],
  });

  describe('activityAvailabilityAtDayTest', () => {
    const testContext = getReminderMockedTestContext({
      periodicity: Periodicity.Always,
    });
    const testContext1 = getReminderMockedTestContext({});
    const testContext2 = getReminderMockedTestContext({
      endDate: new Date('2023-11-15'),
      periodicity: Periodicity.Daily,
    });
    const testContext3 = getReminderMockedTestContext({
      endDate: new Date('2023-11-15'),
      periodicity: Periodicity.Daily,
      endTime: '04:00',
    });
    const testContext4 = getReminderMockedTestContext({
      endDate: new Date('2023-11-15'),
      periodicity: Periodicity.Weekdays,
    });
    const testContext5 = getReminderMockedTestContext({
      endDate: new Date('2023-11-15'),
      periodicity: Periodicity.Weekdays,
      endTime: '03:00',
    });
    const testContext6 = getReminderMockedTestContext({
      periodicity: Periodicity.Weekly,
    });
    const testContext7 = getReminderMockedTestContext({
      periodicity: Periodicity.Weekly,
      endTime: '03:00',
    });
    const testContext8 = getReminderMockedTestContext({
      startDate: new Date('2023-12-04'),
      endDate: new Date('2024-03-31'),
      periodicity: Periodicity.Monthly,
      endTime: '03:00',
    });
    const testContext9 = getReminderMockedTestContext({
      endDate: null,
      periodicity: Periodicity.Daily,
    });
    const testContext10 = getReminderMockedTestContext({
      endDate: null,
      periodicity: Periodicity.Weekdays,
    });
    const testContext11 = getReminderMockedTestContext({
      endDate: null,
      periodicity: Periodicity.Monthly,
    });
    const largeActivityIncomplete = 1000;
    test.each`
      value                      | testContext      | expected | description
      ${largeActivityIncomplete} | ${testContext}   | ${true}  | ${'returns true if Always periodicity'}
      ${undefined}               | ${testContext1}  | ${true}  | ${'returns true when value is falsy or 0'}
      ${0}                       | ${testContext1}  | ${true}  | ${'returns true when value is falsy or 0'}
      ${1}                       | ${testContext1}  | ${true}  | ${'handles Once periodicity'}
      ${2}                       | ${testContext1}  | ${false} | ${'handles Once periodicity'}
      ${largeActivityIncomplete} | ${testContext1}  | ${false} | ${'handles Once periodicity'}
      ${1}                       | ${testContext2}  | ${true}  | ${'handles Daily periodicity'}
      ${3}                       | ${testContext2}  | ${true}  | ${'handles Daily periodicity'}
      ${4}                       | ${testContext2}  | ${false} | ${'handles Daily periodicity'}
      ${16}                      | ${testContext2}  | ${false} | ${'handles Daily periodicity'}
      ${3}                       | ${testContext3}  | ${true}  | ${'handles Daily periodicity: cross-day'}
      ${4}                       | ${testContext3}  | ${true}  | ${'handles Daily periodicity: cross-day'}
      ${5}                       | ${testContext3}  | ${false} | ${'handles Daily periodicity: cross-day'}
      ${largeActivityIncomplete} | ${testContext9}  | ${true}  | ${'handles Daily periodicity: no end date'}
      ${3}                       | ${testContext4}  | ${true}  | ${'handles Weekdays periodicity'}
      ${4}                       | ${testContext4}  | ${false} | ${'handles Weekdays periodicity'}
      ${4}                       | ${testContext5}  | ${true}  | ${'handles Weekdays periodicity: cross-day'}
      ${5}                       | ${testContext5}  | ${false} | ${'handles Weekdays periodicity: cross-day'}
      ${largeActivityIncomplete} | ${testContext10} | ${true}  | ${'handles Weekly periodicity: no end date'}
      ${7}                       | ${testContext6}  | ${true}  | ${'handles Weekly periodicity'}
      ${49}                      | ${testContext6}  | ${true}  | ${'handles Weekly periodicity'}
      ${56}                      | ${testContext6}  | ${false} | ${'handles Weekly periodicity'}
      ${2}                       | ${testContext6}  | ${false} | ${'handles Weekly periodicity'}
      ${8}                       | ${testContext6}  | ${false} | ${'handles Weekly periodicity'}
      ${1}                       | ${testContext7}  | ${true}  | ${'handles Weekly periodicity: cross-day'}
      ${50}                      | ${testContext7}  | ${true}  | ${'handles Weekly periodicity: cross-day'}
      ${2}                       | ${testContext7}  | ${false} | ${'handles Weekly periodicity: cross-day'}
      ${5}                       | ${testContext7}  | ${false} | ${'handles Weekly periodicity: cross-day'}
      ${1}                       | ${testContext8}  | ${true}  | ${'handles Monthly periodicity'}
      ${3}                       | ${testContext8}  | ${true}  | ${'handles Monthly periodicity'}
      ${4}                       | ${testContext8}  | ${false} | ${'handles Monthly periodicity'}
      ${largeActivityIncomplete} | ${testContext11} | ${true}  | ${'handles Monthly periodicity: no end date'}
    `('$description, value=$value, expected=$expected', ({ value, testContext, expected }) => {
      expect(activityAvailabilityAtDayTest(value, testContext)).toBe(expected);
    });
  });

  describe('reminderTimeTest: returns', () => {
    const testContext = getReminderMockedTestContext({
      periodicity: Periodicity.Always,
    });
    const testContext1 = getReminderMockedTestContext({
      activityIncomplete: 1,
    });
    const testContext2 = getReminderMockedTestContext({
      periodicity: Periodicity.Weekdays,
      startTime: '20:00',
      endTime: '11:00',
      activityIncomplete: 1,
    });
    const testContext3 = getReminderMockedTestContext({
      periodicity: Periodicity.Monthly,
      startTime: '20:00',
      endTime: '11:00',
      activityIncomplete: 1,
    });
    const testContext4 = getReminderMockedTestContext({
      periodicity: Periodicity.Once,
      startTime: '11:00',
      endTime: '15:00',
      activityIncomplete: 1,
    });
    const testContext5 = getReminderMockedTestContext({
      periodicity: Periodicity.Once,
      startTime: '22:00',
      endTime: '15:00',
      activityIncomplete: 0,
    });
    const testContext6 = getReminderMockedTestContext({
      periodicity: Periodicity.Once,
      startTime: '22:00',
      endTime: '15:00',
      activityIncomplete: 1,
    });
    const testContext7 = getReminderMockedTestContext({
      periodicity: Periodicity.Daily,
      startDate: new Date('2023-12-12'),
      endDate: new Date('2023-12-15'),
      startTime: '23:00',
      endTime: '10:00',
      activityIncomplete: 0,
    });
    const testContext8 = getReminderMockedTestContext({
      periodicity: Periodicity.Daily,
      startDate: new Date('2023-12-12'),
      endDate: new Date('2023-12-15'),
      startTime: '23:00',
      endTime: '10:00',
      activityIncomplete: 4,
    });
    const testContext9 = getReminderMockedTestContext({
      periodicity: Periodicity.Daily,
      startDate: new Date('2023-12-12'),
      endDate: new Date('2023-12-15'),
      startTime: '23:00',
      endTime: '10:00',
      activityIncomplete: 2,
    });
    const testContext10 = getReminderMockedTestContext({
      periodicity: Periodicity.Weekly,
      startDate: new Date('2023-12-12'),
      endDate: new Date('2023-12-31'),
      startTime: '23:00',
      endTime: '10:00',
      activityIncomplete: 7,
    });
    const testContext11 = getReminderMockedTestContext({
      periodicity: Periodicity.Weekly,
      startDate: new Date('2023-12-12'),
      endDate: new Date('2023-12-31'),
      startTime: '23:00',
      endTime: '10:00',
      activityIncomplete: 8,
    });
    const testContext12 = getReminderMockedTestContext({
      periodicity: Periodicity.Weekdays,
      startTime: '23:00',
      endTime: '10:00',
      activityIncomplete: 0,
    });
    const testContext13 = getReminderMockedTestContext({
      periodicity: Periodicity.Weekdays,
      startDate: new Date('2023-12-12'),
      endDate: new Date('2023-12-15'),
      startTime: '23:00',
      endTime: '10:00',
      activityIncomplete: 4,
    });

    test.each`
      reminderTime | testContext      | expected | description
      ${'12:00'}   | ${testContext}   | ${true}  | ${'Always periodicity'}
      ${undefined} | ${testContext1}  | ${true}  | ${'reminderTime is falsy or 0'}
      ${0}         | ${testContext1}  | ${true}  | ${'reminderTime is falsy or 0'}
      ${'11:00'}   | ${testContext1}  | ${true}  | ${'not cross-day and time is between startTime and endTime'}
      ${'09:00'}   | ${testContext1}  | ${true}  | ${'not cross-day and time is outside startTime and endTime'}
      ${'20:00'}   | ${testContext3}  | ${true}  | ${'Monthly periodicity cross-day and time is between startTime and endTime'}
      ${'19:00'}   | ${testContext3}  | ${false} | ${'Monthly periodicity cross-day and time is outside startTime and endTime'}
      ${'15:00'}   | ${testContext4}  | ${true}  | ${'Once periodicity not cross-day, time is between startTime and endTime'}
      ${'23:00'}   | ${testContext4}  | ${false} | ${'Once periodicity not cross-day, time is outside startTime and endTime'}
      ${'22:30'}   | ${testContext5}  | ${true}  | ${'Once periodicity cross-day: first day and time is between startTime and 23:59'}
      ${'20:50'}   | ${testContext5}  | ${false} | ${'Once periodicity cross-day: first day and time is outside startTime and 23:59'}
      ${'02:50'}   | ${testContext6}  | ${true}  | ${'Once periodicity cross-day: second day and time is between 00:00 and endTime'}
      ${'23:50'}   | ${testContext6}  | ${false} | ${'Once periodicity cross-day: second day and time is outside 00:00 and endTime'}
      ${'23:30'}   | ${testContext7}  | ${true}  | ${'Daily periodicity cross-day: first day and time is between startTime and 23:59'}
      ${'15:50'}   | ${testContext7}  | ${false} | ${'Daily periodicity cross-day: first day and time is outside startTime and 23:59'}
      ${'09:30'}   | ${testContext8}  | ${true}  | ${'Daily periodicity cross-day: last day and and time is between 00:00 and endTime'}
      ${'10:01'}   | ${testContext8}  | ${false} | ${'Daily periodicity cross-day: last day and time is outside 00:00 and endTime'}
      ${'09:30'}   | ${testContext9}  | ${true}  | ${'Daily periodicity cross-day: not first or last day and time is between startTime and endTime'}
      ${'15:25'}   | ${testContext9}  | ${false} | ${'Daily periodicity cross-day: not first or last day and time is outside startTime and endTime'}
      ${'23:00'}   | ${testContext10} | ${true}  | ${'Weekly periodicity cross-day: first day and time is between startTime and 23:59'}
      ${'09:30'}   | ${testContext10} | ${false} | ${'Weekly periodicity cross-day: first day and time is outside startTime and 23:59'}
      ${'10:00'}   | ${testContext11} | ${true}  | ${'Weekly periodicity cross-day: next day and and time is between 00:00 and endTime'}
      ${'10:50'}   | ${testContext11} | ${false} | ${'Weekly periodicity cross-day: next day and time is outside 00:00 and endTime'}
      ${'10:00'}   | ${testContext2}  | ${true}  | ${'Weekdays periodicity cross-day and time is between startTime and endTime'}
      ${'14:00'}   | ${testContext2}  | ${false} | ${'Weekdays periodicity cross-day and time is outside startTime and endTime'}
      ${'23:30'}   | ${testContext12} | ${true}  | ${'Weekdays periodicity cross-day: first day and time is between startTime and 23:59'}
      ${'15:50'}   | ${testContext12} | ${false} | ${'Weekdays periodicity cross-day: first day and time is outside startTime and 23:59'}
      ${'09:30'}   | ${testContext13} | ${true}  | ${'Weekdays periodicity cross-day: last day and and time is between 00:00 and endTime'}
      ${'10:01'}   | ${testContext13} | ${false} | ${'Weekdays periodicity cross-day: last day and time is outside 00:00 and endTime'}
    `(
      '$description, reminderTime=$reminderTime, expected=$expected',
      ({ reminderTime, testContext, expected }) => {
        expect(reminderTimeTest(reminderTime, testContext)).toBe(expected);
      },
    );
  });
});

import { notificationValidPeriodTest } from './EventForm.utils';
import {
  getBetweenStartEndNextDayComparison,
  getBetweenStartEndNextDaySingleComparison,
  getNextDayComparison,
} from './EventForm.utils';

describe('EventForm.utils', () => {
  describe('getNextDayComparison', () => {
    test.each`
      startTime  | endTime    | expected
      ${'14:00'} | ${'05:00'} | ${true}
      ${'00:00'} | ${'23:59'} | ${false}
      ${'12:00'} | ${'12:00'} | ${false}
    `(
      'time=$time, rangeStart=$rangeStartTime, rangeStart=$rangeEndTime:',
      ({ startTime, endTime, expected }) => {
        expect(getNextDayComparison(startTime, endTime)).toBe(expected);
      },
    );
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
    `(
      'time=$time, fromTime=$fromTime, toTime=$toTime, rangeStart=$rangeStartTime, rangeStart=$rangeEndTime:',
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
});

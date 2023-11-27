import { endOfYear } from 'date-fns';

import { Periodicity } from 'modules/Dashboard/api';

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
} from './EventForm.utils';

const mockedEvent = {
  id: '12',
  activityOrFlowId: '123',
  eventId: '123456',
  title: 'test title',
  start: new Date(),
  end: new Date(),
  backgroundColor: '#fff',
  alwaysAvailable: false,
  isHidden: false,
  periodicity: Periodicity.Once,
  eventStart: new Date(),
  eventEnd: null,
  startTime: '00:00',
  endTime: '23:59',
};

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

  // describe('getStartEndDates', () => {
  //   const defaultStartDate = new Date('2023-01-01');
  //   it('should return default start and end dates for periodicity once', () => {
  //     const result = getStartEndDates(true, false, defaultStartDate);
  //     expect(result).toEqual({
  //       startDate: defaultStartDate,
  //       endDate: endOfYear(defaultStartDate),
  //     });
  //   });
  //
  //   it('should return default start and end dates for periodicity always', () => {
  //     const result = getStartEndDates(false, true, defaultStartDate);
  //     expect(result).toEqual({
  //       startDate: defaultStartDate,
  //       endDate: endOfYear(defaultStartDate),
  //     });
  //   });
  //
  //   it('should return event start and end dates if not periodicity once or always', () => {
  //     const result = getStartEndDates(false, false, defaultStartDate, sampleEvent.start, sampleEvent.end);
  //     expect(result).toEqual({
  //       startDate: mockedEvent.start,
  //       endDate: mockedEvent.end,
  //     });
  //   });
  //
  //   it('should return default start and computed end date if event end is null', () => {
  //     const result = getStartEndDates(false, false, defaultStartDate, mockedEvent.start, null, mockedEvent);
  //     expect(result).toEqual({
  //       startDate: mockedEvent.start,
  //       endDate: endOfYear(mockedEvent.start),
  //     });
  //   });
  //
  //   it('should return default start and event end date if event end is provided', () => {
  //     const result = getStartEndDates(false, false, defaultStartDate, mockedEvent.start, mockedEvent.end, mockedEvent);
  //     expect(result).toEqual({
  //       startDate: mockedEvent.start,
  //       endDate: mockedEvent.end,
  //     });
  //   });
  //
  //   it('should return default start date if event start is not provided', () => {
  //     const result = getStartEndDates(false, false, defaultStartDate, undefined, mockedEvent.end, mockedEvent);
  //     expect(result).toEqual({
  //       startDate: defaultStartDate,
  //       endDate: mockedEvent.end,
  //     });
  //   });
  // });

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

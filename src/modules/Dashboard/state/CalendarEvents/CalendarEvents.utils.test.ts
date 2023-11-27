import { getNextDayComparison } from './CalendarEvents.utils';

describe('CalendarEvents.utils', () => {
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
});

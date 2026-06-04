import { vi } from 'vitest';

import {
  formatDateAsUTC,
  getDateInUserTimezone,
  getLast24hUTCRange,
  getNormalizedTimezoneDate,
  getNormalizeTimezoneData,
  MINUTES_TO_MILLISECONDS_MULTIPLIER,
} from './dateTimezone';

const systemTimeZoneOffset = new Date().getTimezoneOffset() * MINUTES_TO_MILLISECONDS_MULTIPLIER;
const dateString = '2023-10-12T12:00:00Z';
const dateStringDst = '2023-03-27T12:00:00Z';
const { dateTime } = getNormalizeTimezoneData(dateString);
const { dateTime: dateTimeDst } = getNormalizeTimezoneData(dateStringDst);

describe('getDateInUserTimezone', () => {
  const expectedDate = new Date(dateTime - systemTimeZoneOffset);
  const expectedDateDst = new Date(dateTimeDst - systemTimeZoneOffset);
  test.each`
    dateString       | expected           | description
    ${dateString}    | ${expectedDate}    | ${'correct date in the user timezone'}
    ${dateStringDst} | ${expectedDateDst} | ${'should handle daylight saving time changes'}
  `('$description', ({ dateString, expected }) => {
    expect(getDateInUserTimezone(dateString).getTime()).toEqual(expected.getTime());
  });
});

describe('getNormalizedTimezoneDate', () => {
  const expectedDate = new Date(dateTime + systemTimeZoneOffset);
  const expectedDateDst = new Date(dateTimeDst + systemTimeZoneOffset);
  test.each`
    dateString       | expected           | description
    ${dateString}    | ${expectedDate}    | ${'correct normalized timezone date'}
    ${dateStringDst} | ${expectedDateDst} | ${'should handle daylight saving time changes'}
  `('$description', ({ dateString, expected }) => {
    expect(getNormalizedTimezoneDate(dateString).getTime()).toEqual(expected.getTime());
  });
});

describe('formatDateAsUTC', () => {
  test('formats using UTC time, not local time', () => {
    const date = new Date(Date.UTC(2026, 5, 1, 20, 30, 45));

    // Simulate UTC-5: local getters return different values than UTC
    vi.spyOn(date, 'getHours').mockReturnValue(15);
    vi.spyOn(date, 'getFullYear').mockReturnValue(2026);
    vi.spyOn(date, 'getMonth').mockReturnValue(5);
    vi.spyOn(date, 'getDate').mockReturnValue(1);
    vi.spyOn(date, 'getMinutes').mockReturnValue(30);
    vi.spyOn(date, 'getSeconds').mockReturnValue(45);

    const result = formatDateAsUTC(date);

    // Should be 20:30:45 (UTC), not 15:30:45 (local)
    expect(result).toBe('2026-06-01T20:30:45');
  });
});

describe('getLast24hUTCRange', () => {
  test('returns fromDate 24 hours before toDate', () => {
    const before = new Date();
    const { fromDate, toDate } = getLast24hUTCRange();
    const after = new Date();

    const parsedFrom = new Date(fromDate);
    const parsedTo = new Date(toDate);

    const diffMs = parsedTo.getTime() - parsedFrom.getTime();
    expect(diffMs).toBe(24 * 60 * 60 * 1000);

    expect(parsedTo.getTime()).toBeGreaterThanOrEqual(before.getTime() - 1000);
    expect(parsedTo.getTime()).toBeLessThanOrEqual(after.getTime() + 1000);
  });

  test('returns dates in shortISO format without timezone suffix', () => {
    const { fromDate, toDate } = getLast24hUTCRange();
    const shortISOPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

    expect(fromDate).toMatch(shortISOPattern);
    expect(toDate).toMatch(shortISOPattern);
  });
});

describe('Timezones', () => {
  test('should always be UTC', () => {
    expect(new Date().getTimezoneOffset()).toBe(0);
  });
});

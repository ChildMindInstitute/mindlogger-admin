import { NameLength } from 'modules/Dashboard/features/Applet/Schedule/Calendar/Calendar.types';

import {
  formatToWeekYear,
  formatToYearMonthDate,
  getDayName,
  getMonthName,
  getMoreText,
  parseDateToMidnightLocal,
} from './dateFormat';

const firstDate = new Date('2023-10-22T12:00:00Z');
const secondDate = new Date('2023-10-23T23:00:00Z');

describe('formatToYearMonthDate', () => {
  test.each`
    date          | expected         | description
    ${firstDate}  | ${'22 Oct 2023'} | ${'should be 22 oct'}
    ${secondDate} | ${'23 Oct 2023'} | ${'should be 23 oct'}
  `('$description', ({ date, expected }) => {
    expect(formatToYearMonthDate(date)).toBe(expected);
  });
});

describe('formatToWeekYear', () => {
  test.each`
    date          | expected     | description
    ${firstDate}  | ${'42 2023'} | ${'should be 42 week'}
    ${secondDate} | ${'43 2023'} | ${'should be 43 week'}
  `('$description', ({ date, expected }) => {
    expect(formatToWeekYear(date)).toBe(expected);
  });
});

describe('getMoreText', () => {
  test('should return more with dots', () => {
    expect(getMoreText()).toBe('more...');
  });
});

describe('getDayName', () => {
  test.each`
    date          | expected    | description
    ${firstDate}  | ${'Sunday'} | ${'should be Sunday'}
    ${secondDate} | ${'Monday'} | ${'should be Monday'}
  `('$description', ({ date, expected }) => {
    expect(getDayName(date)).toBe(expected);
  });
});

describe('getMonthName', () => {
  test.each`
    date         | length              | expected     | description
    ${firstDate} | ${undefined}        | ${'October'} | ${'should be correct month name'}
    ${firstDate} | ${NameLength.Long}  | ${'October'} | ${'should be correct long month name'}
    ${firstDate} | ${NameLength.Short} | ${'Oct'}     | ${'should be correct short month name'}
  `('$description', ({ date, length, expected }) => {
    expect(getMonthName(date, length)).toBe(expected);
  });
});

describe('parseDateToMidnightLocal', () => {
  it('should return a Date object for a valid date string', () => {
    const dateStr = '2025-01-01';
    const result = parseDateToMidnightLocal(dateStr);
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toContain('2025-01-01');
  });

  test('should throw error for invalid formats', () => {
    expect(() => parseDateToMidnightLocal('2025/01/01')).toThrow(
      '[parseDateToMidnightLocal] Invalid date string format',
    );
    expect(() => parseDateToMidnightLocal('2025-01')).toThrow(
      '[parseDateToMidnightLocal] Invalid date string format',
    );
    expect(() => parseDateToMidnightLocal('invalid-date')).toThrow(
      '[parseDateToMidnightLocal] Invalid date string format',
    );
    expect(() => parseDateToMidnightLocal('')).toThrow(
      '[parseDateToMidnightLocal] Invalid date string format',
    );
  });

  it('should preserve the local date without timezone offset', () => {
    const dateStr = '2024-06-15';
    const result = parseDateToMidnightLocal(dateStr);
    expect(result.getDate()).toBe(15);
    expect(result.getMonth()).toBe(5); // June is 5 (zero-based)
    expect(result.getFullYear()).toBe(2024);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });
});

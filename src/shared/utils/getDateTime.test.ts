import { getDateTime } from './getDateTime';

describe('getDateTime', () => {
  test('returns the correct DateTime when both date and valid time are provided', () => {
    const date = new Date('2023-01-01');
    const time = '12:30';
    const result = getDateTime(date, time);
    const expected = new Date('2023-01-01T12:30:00');

    expect(result).toEqual(expected);
  });

  test('returns the correct DateTime when invalid time format is provided', () => {
    const date = new Date('2023-01-01');
    const invalidTime = 'invalid-time';
    const result = getDateTime(date, invalidTime);
    const expected = new Date(date);

    expect(result).toEqual(expected);
  });

  test('returns the correct DateTime when no time is provided', () => {
    const date = new Date('2023-01-01');
    const result = getDateTime(date, '');
    const expected = new Date(date);

    expect(result).toEqual(expected);
  });

  test('returns the correct DateTime when incorrect time (24:00) is provided', () => {
    const date = new Date('2023-01-01');
    const invalidTime = '24:00';
    const result = getDateTime(date, invalidTime);
    const expected = new Date(date);

    expect(result).toEqual(expected);
  });

  test('handles midnight correctly', () => {
    const date = new Date('2023-01-01');
    const midnightTime = '00:00';
    const result = getDateTime(date, midnightTime);
    const expected = new Date('2023-01-01T00:00:00');

    expect(result).toEqual(expected);
  });
});

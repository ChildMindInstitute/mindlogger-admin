import { convertToMinutes } from './convertToMinutes';

describe('convertToMinutes', () => {
  test.each([
    ['valid time string "12:34"', '12:34', 754],
    ['valid time string "00:00"', '00:00', 0],
    ['valid time string "23:59"', '23:59', 1439],
    ['null time string', null, null],
    ['invalid time string "24:00"', '24:00', null],
    ['invalid time string "12:60"', '12:60', null],
    ['invalid time string "12:34:56"', '12:34:56', null],
    ['invalid time string "abc"', 'abc', null],
    ['invalid time string "12:3"', '12:3', null],
    ['invalid time string "1:34"', '1:34', null],
    ['empty string', '', null],
  ])('should return %s', (_, input, expected) => {
    expect(convertToMinutes(input)).toBe(expected);
  });
});

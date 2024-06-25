import { cleanInput, validateInput, formatInput } from './TimePicker.utils';

describe('cleanInput', () => {
  test.each([
    ['12:34', '1234'],
    ['ab12cd34', '1234'],
    ['!@#1234', '1234'],
    ['', ''],
    ['abcd', ''],
  ])('should remove all non-digit characters from "%s"', (input, expected) => {
    expect(cleanInput(input)).toBe(expected);
  });
});

describe('validateInput', () => {
  const defaultTime = '00:00';

  test.each([
    ['1234', '1234'],
    ['0000', '0000'],
    ['2359', '2359'],
    ['1275', '0000'],
    ['1280', '0000'],
  ])('should validate input "%s" and return "%s"', (input, expected) => {
    expect(validateInput(defaultTime, input)).toBe(expected);
  });
});

describe('formatInput', () => {
  test.each([
    ['1234', '12:34'],
    ['0000', '00:00'],
    ['2359', '23:59'],
    ['12', '12:00'],
    ['23', '23:00'],
  ])('should format input "%s" as "%s"', (input, expected) => {
    expect(formatInput(input)).toBe(expected);
  });
});

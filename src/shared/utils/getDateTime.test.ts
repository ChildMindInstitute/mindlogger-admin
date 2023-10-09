import { getDateTime } from './getDateTime';

describe('getDateTime', () => {
  const date = new Date('2023-01-01');
  const time = '12:30';
  const expected1 = new Date('2023-01-01T12:30:00');
  const expected2 = new Date('2023-01-01T00:00:00');
  test.each`
    date    | time              | expected     | description
    ${date} | ${time}           | ${expected1} | ${'correct DateTime with date and valid time'}
    ${date} | ${'invalid-time'} | ${date}      | ${'correct DateTime with invalid time format is provided'}
    ${date} | ${''}             | ${date}      | ${'correct DateTime when no time is provided'}
    ${date} | ${'24:00'}        | ${date}      | ${'correct DateTime when incorrect time (24:00) is provided'}
    ${date} | ${'00:00'}        | ${expected2} | ${'handles midnight correctly'}
  `('$description', ({ date, time, expected }) => {
    expect(getDateTime(date, time)).toEqual(expected);
  });
});

import { formatSecondsToMinutes } from './RecordAudio.utils';

describe('formatSecondsToMinutes', () => {
  test.each([
    [65, '01:05'],
    [3600, '60:00'],
    [123, '02:03'],
    [5, '00:05'],
    [9, '00:09'],
    [0, '00:00'],
    [9999, '166:39'],
  ])('formats %s seconds to %s', (seconds, expected) => {
    expect(formatSecondsToMinutes(seconds)).toBe(expected);
  });
});

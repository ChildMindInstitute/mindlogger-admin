import { format } from 'date-fns';
import { DateFormats } from 'shared/consts';
import { getTimeResponseItem } from './Review.utils';

describe('getTimeResponseItem', () => {
  test.each`
    answer                                   | expected                                                 | description
    ${undefined}                             | ${undefined}                                             | ${'should return undefined if answer is not provided'}
    ${{ value: { hours: 12, minutes: 30 } }} | ${format(new Date().setHours(12, 30), DateFormats.Time)} | ${'should return the formatted time when answer contains hours and minutes'}
    ${{ hour: 9, minute: 15 }}               | ${format(new Date().setHours(9, 15), DateFormats.Time)}  | ${'should use "hour" and "minute" properties if "value" is not provided'}
  `('$description', ({ answer, expected }) => {
    const result = getTimeResponseItem(answer);
    expect(result).toBe(expected);
  });
});

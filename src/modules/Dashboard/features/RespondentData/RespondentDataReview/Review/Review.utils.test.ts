import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';

import { getTimeResponseItem } from './Review.utils';

const timeResponse1 = { value: { hours: 9, minutes: 15 } };
const timeResponse2 = { hour: 9, minute: 15 };
const expected = format(new Date().setHours(9, 15), DateFormats.Time);

describe('getTimeResponseItem', () => {
  test.each`
    answer           | expected     | description
    ${undefined}     | ${undefined} | ${'should return undefined if answer is not provided'}
    ${timeResponse1} | ${expected}  | ${'should return the formatted time when answer contains hours and minutes'}
    ${timeResponse2} | ${expected}  | ${'should use "hour" and "minute" properties if "value" is not provided'}
  `('$description', ({ answer, expected }) => {
    const result = getTimeResponseItem(answer);
    expect(result).toBe(expected);
  });
});

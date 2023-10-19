import { format } from 'date-fns';

import { DateFormats } from 'shared/consts';

import { getTimeResponseItem } from './Review.utils';

describe('getTimeResponseItem', () => {
  it('should return undefined if answer is not provided', () => {
    const result = getTimeResponseItem();
    expect(result).toBeUndefined();
  });

  it('should return the formatted time when answer contains hours and minutes', () => {
    const answer = { value: { hours: 12, minutes: 30 } };
    const formattedTime = format(new Date().setHours(12, 30), DateFormats.Time);
    const result = getTimeResponseItem(answer);
    expect(result).toBe(formattedTime);
  });

  it('should use "hour" and "minute" properties if "value" is not provided', () => {
    const answer = { hour: 9, minute: 15 };
    const formattedTime = format(new Date().setHours(9, 15), DateFormats.Time);
    const result = getTimeResponseItem(answer);
    expect(result).toBe(formattedTime);
  });
});

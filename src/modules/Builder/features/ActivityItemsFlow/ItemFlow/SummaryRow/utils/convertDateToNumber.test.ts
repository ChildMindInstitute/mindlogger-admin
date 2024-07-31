import { convertDateToNumber } from './convertDateToNumber';

describe('convertDateToNumber', () => {
  // base date is equal to new Date('1900-01-01');
  test.each([
    ['same as base date', new Date('1900-01-01'), 1],
    ['one day after base date', new Date('1900-01-02'), 2],
    ['one day before base date', new Date('1899-12-31'), 0],
    ['multiple days after base date', new Date('1900-01-10'), 10],
    ['multiple days before base date', new Date('1899-12-22'), -9],
    ['null date', null, null],
    ['specific date far in future', new Date('2024-07-23'), 45495],
    ['specific date far in past', new Date('1800-01-01'), -36523],
    ['invalid date string', new Date('invalid date'), null],
    ['string instead of date', '2024-07-23', null],
    ['number instead of date', 1234567890, null],
    ['object instead of date', {}, null],
    ['array instead of date', [], null],
    ['boolean instead of date', true, null],
  ])('should return correct number for %s', (_, input, expected) => {
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect(convertDateToNumber(input)).toBe(expected);
  });
});

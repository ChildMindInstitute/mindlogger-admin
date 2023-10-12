import {
  getDateInUserTimezone,
  getNormalizedTimezoneDate,
  getNormalizeTimezoneData,
  MINUTES_TO_MILLISECONDS_MULTIPLIER,
} from './dateTimezone';

const systemTimeZoneOffset = new Date().getTimezoneOffset() * MINUTES_TO_MILLISECONDS_MULTIPLIER;
const dateString = '2023-10-12T12:00:00Z';
const dateStringDst = '2023-03-27T12:00:00Z';
const { dateTime } = getNormalizeTimezoneData(dateString);
const { dateTime: dateTimeDst } = getNormalizeTimezoneData(dateStringDst);

describe('getDateInUserTimezone', () => {
  const expectedDate = new Date(dateTime - systemTimeZoneOffset);
  const expectedDateDst = new Date(dateTimeDst - systemTimeZoneOffset);
  test.each`
    dateString       | expected           | description
    ${dateString}    | ${expectedDate}    | ${'correct date in the user timezone'}
    ${dateStringDst} | ${expectedDateDst} | ${'should handle daylight saving time changes'}
  `('$description', ({ dateString, expected }) => {
    expect(getDateInUserTimezone(dateString).getTime()).toEqual(expected.getTime());
  });
});

describe('getNormalizedTimezoneDate', () => {
  const expectedDate = new Date(dateTime + systemTimeZoneOffset);
  const expectedDateDst = new Date(dateTimeDst + systemTimeZoneOffset);
  test.each`
    dateString       | expected           | description
    ${dateString}    | ${expectedDate}    | ${'correct normalized timezone date'}
    ${dateStringDst} | ${expectedDateDst} | ${'should handle daylight saving time changes'}
  `('$description', ({ dateString, expected }) => {
    expect(getNormalizedTimezoneDate(dateString).getTime()).toEqual(expected.getTime());
  });
});

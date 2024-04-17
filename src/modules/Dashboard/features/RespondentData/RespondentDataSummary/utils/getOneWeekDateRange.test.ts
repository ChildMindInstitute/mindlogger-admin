import { getOneWeekDateRange } from './getOneWeekDateRange';

describe('getOneWeekDateRange', () => {
  const dateString = '2024-04-16T16:35:25.408000';
  const expectedStart = '2024-04-10T00:00:00.000000';
  const expectedEnd = '2024-04-16T23:59:59.999999';

  test.each`
    dateString               | expectedStartDate | expectedEndDate | description
    ${null}                  | ${null}           | ${null}         | ${'should return null for both startDate and endDate if dateString is null'}
    ${dateString}            | ${expectedStart}  | ${expectedEnd}  | ${'should return correct startDate and endDate for a given dateString'}
    ${'invalid-date-string'} | ${null}           | ${null}         | ${'should return null for both startDate and endDate if dateString is invalid'}
  `('$description', ({ dateString, expectedStartDate, expectedEndDate }) => {
    const { startDate, endDate } = getOneWeekDateRange(dateString);

    expect(startDate).toEqual(expectedStartDate ? new Date(expectedStartDate) : null);
    expect(endDate).toEqual(expectedEndDate ? new Date(expectedEndDate) : null);
  });
});

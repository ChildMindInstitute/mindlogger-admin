import { getDateISO, getIdentifiers } from './useRespondentAnswers.utils';

describe('respondent answers utils', () => {
  describe('getDateISO', () => {
    test.each`
      date                                | time       | expectedOutput           | description
      ${new Date('2023-10-19T12:30:00Z')} | ${'15:45'} | ${'2023-10-19T15:45:00'} | ${'should format a date and time to ISO string'}
      ${new Date('2023-10-19T12:35:00Z')} | ${'5:5'}   | ${'2023-10-19T05:05:00'} | ${'should handle a date and time with single-digit hours and minutes'}
    `('$description', ({ date, time, expectedOutput }) => {
      const result = getDateISO(date, time);
      expect(result).toBe(expectedOutput);
    });
  });

  describe('getIdentifiers', () => {
    const mockIdentifiers = [
      { encryptedValue: 'encrypted1', decryptedValue: 'decrypted1' },
      { encryptedValue: 'encrypted2', decryptedValue: 'decrypted2' },
    ];

    const multipleMockFilterIdentifiers = [{ id: 'decrypted1' }, { id: 'decrypted2' }];

    const mockFilterIdentifiers = [{ id: 'decrypted1' }];

    test.each`
      filterByIdentifier | filterIdentifiers                | identifiers        | expectedResult
      ${false}           | ${mockFilterIdentifiers}         | ${mockIdentifiers} | ${undefined}
      ${true}            | ${mockFilterIdentifiers}         | ${mockIdentifiers} | ${['encrypted1']}
      ${true}            | ${[]}                            | ${mockIdentifiers} | ${[]}
      ${true}            | ${multipleMockFilterIdentifiers} | ${mockIdentifiers} | ${['encrypted1', 'encrypted2']}
    `(
      'returns $expectedResult when filterByIdentifier is $filterByIdentifier',
      ({ filterByIdentifier, filterIdentifiers, identifiers, expectedResult }) => {
        const result = getIdentifiers(filterByIdentifier, filterIdentifiers, identifiers);
        expect(result).toEqual(expectedResult);
      },
    );
  });
});

import { endOfDay, startOfDay, subDays } from 'date-fns';

import { getDateISO, getIdentifiers, processIdentifiersChange } from './useRespondentAnswers.utils';

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
      {
        encryptedValue: 'encrypted1',
        decryptedValue: 'decrypted1',
        lastAnswerDate: '2023-09-26T10:10:05.162083',
      },
      {
        encryptedValue: 'encrypted2',
        decryptedValue: 'decrypted2',
        lastAnswerDate: '2023-12-15T10:10:05.162083',
      },
    ];
    const multipleFilterIdentifiers = [{ id: 'decrypted1' }, { id: 'decrypted2' }];
    const mockFilterIdentifiers = [{ id: 'decrypted1' }];
    const result1 = {
      selectedIdentifiers: ['encrypted1'],
      recentAnswerDateString: '2023-09-26T10:10:05.162083',
    };
    const result2 = {
      selectedIdentifiers: [],
      recentAnswerDateString: '',
    };
    const result3 = {
      selectedIdentifiers: ['encrypted1', 'encrypted2'],
      recentAnswerDateString: '2023-12-15T10:10:05.162083',
    };
    const desc1 = 'returns null when filterByIdentifier is false';
    const desc2 =
      'returns one identifier and correct recentAnswerDateString when filterIdentifiers has one item';
    const desc3 =
      'returns an empty array for selected identifiers and an empty recentAnswerDateString when filterIdentifiers is an empty array';
    const desc4 =
      'returns several identifiers and correct recentAnswerDateString when filterIdentifiers has multiple items';

    test.each`
      filterByIdentifier | filterIdentifiers            | identifiers        | expectedResult | description
      ${false}           | ${mockFilterIdentifiers}     | ${mockIdentifiers} | ${null}        | ${desc1}
      ${true}            | ${mockFilterIdentifiers}     | ${mockIdentifiers} | ${result1}     | ${desc2}
      ${true}            | ${[]}                        | ${mockIdentifiers} | ${result2}     | ${desc3}
      ${true}            | ${multipleFilterIdentifiers} | ${mockIdentifiers} | ${result3}     | ${desc4}
    `('$description', ({ filterByIdentifier, filterIdentifiers, identifiers, expectedResult }) => {
      const result = getIdentifiers({ filterByIdentifier, filterIdentifiers, identifiers });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('processIdentifiersChange', () => {
    const setValue = vi.fn();
    const props = {
      isIdentifiersChange: true,
      adjustStartEndDates: true,
      setValue,
      lastAnswerDate: '2023-09-26T10:10:05.162083',
      recentIdentifiersAnswerDate: '2023-08-15T10:01:07.1112536',
    };

    afterEach(() => {
      vi.clearAllMocks();
    });

    test('should return null if isIdentifiersChange is false', () => {
      const result = processIdentifiersChange({ ...props, isIdentifiersChange: false });

      expect(result).toBeNull();
      expect(setValue).not.toHaveBeenCalled();
    });

    test('should adjust start and end dates if adjustStartEndDates is true', () => {
      const result = processIdentifiersChange(props);
      const identifierAnswerEndDate = endOfDay(new Date('2023-08-15'));
      const identifierAnswerStartDate = startOfDay(subDays(identifierAnswerEndDate, 6));

      expect(result).toEqual({
        identifierAnswerStartDate,
        identifierAnswerEndDate,
        activityAnswerStartDate: undefined,
        activityAnswerEndDate: undefined,
      });
      expect(setValue).toHaveBeenCalledTimes(2);
      expect(setValue).toHaveBeenCalledWith('startDate', identifierAnswerStartDate);
      expect(setValue).toHaveBeenCalledWith('endDate', identifierAnswerEndDate);
    });

    test('should use lastAnswerDate if adjustStartEndDates is false', () => {
      const result = processIdentifiersChange({ ...props, adjustStartEndDates: false });
      const answerEndDate = endOfDay(new Date('2023-09-26'));
      const answerStartDate = startOfDay(subDays(answerEndDate, 6));

      expect(result).toEqual({
        identifierAnswerStartDate: undefined,
        identifierAnswerEndDate: undefined,
        answerStartDate,
        answerEndDate,
      });
      expect(setValue).toHaveBeenCalledTimes(2);
      expect(setValue).toHaveBeenCalledWith('startDate', answerStartDate);
      expect(setValue).toHaveBeenCalledWith('endDate', answerEndDate);
    });
  });
});

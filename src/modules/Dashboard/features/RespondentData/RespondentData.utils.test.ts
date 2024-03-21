import {
  createArrayForSlider,
  getUniqueIdentifierOptions,
  getDateFormattedResponse,
} from './RespondentData.utils';

describe('Respondent Data utils', () => {
  describe('createArrayForSlider', () => {
    test('should create an array with the correct length', () => {
      const result = createArrayForSlider({ maxValue: 5, minValue: 1 });
      expect(result).toHaveLength(5);
    });

    test('should create an array with the correct values and labels', () => {
      const result = createArrayForSlider({ maxValue: 3, minValue: 0 });
      expect(result).toEqual([
        { value: 0, label: 0 },
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
      ]);
    });

    test('should create an array with a single element when minValue and maxValue are the same', () => {
      const result = createArrayForSlider({ maxValue: 2, minValue: 2 });
      expect(result).toEqual([{ value: 2, label: 2 }]);
    });
  });

  describe('getDateFormattedResponse', () => {
    const validAnswer = {
      value: {
        year: 2024,
        month: 3,
        day: 17,
      },
    };
    const invalidAnswer = {
      value: null,
    };
    test.each`
      answer           | result           | description
      ${validAnswer}   | ${'17 Mar 2024'} | ${JSON.stringify(validAnswer)}
      ${invalidAnswer} | ${''}            | ${'empty string'}
      ${null}          | ${''}            | ${'empty string'}
    `('should return "$result" when $description', ({ answer, result }) => {
      expect(getDateFormattedResponse(answer)).toStrictEqual(result);
    });
  });

  describe('getUniqueIdentifierOptions', () => {
    test('should return an empty array for an empty identifiers array', () => {
      const result = getUniqueIdentifierOptions([]);
      expect(result).toEqual([]);
    });

    test('should return unique identifier options', () => {
      const identifiers = [
        { decryptedValue: 'decryptedValue_id1', encryptedValue: 'encryptedValue_id1' },
        { decryptedValue: 'decryptedValue_id2', encryptedValue: 'encryptedValue_id2' },
        { decryptedValue: 'decryptedValue_id2', encryptedValue: 'encryptedValue_id2' }, // duplicate
      ];

      const result = getUniqueIdentifierOptions(identifiers);
      expect(result).toEqual([
        { label: 'decryptedValue_id1', id: 'decryptedValue_id1' },
        { label: 'decryptedValue_id2', id: 'decryptedValue_id2' },
      ]);
    });
  });
});

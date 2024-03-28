import {
  createArrayForSlider,
  getDateFormattedResponse,
  getTimeRangeResponse,
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
    const skippedAnswer = {
      value: null,
    };
    const invalidValue = null;
    test.each`
      answer           | result           | description
      ${validAnswer}   | ${'17 Mar 2024'} | ${JSON.stringify(validAnswer)}
      ${skippedAnswer} | ${''}            | ${'empty string when skipped or hidden'}
      ${invalidValue}  | ${''}            | ${'empty string when invalid'}
    `('should return "$result" when $description', ({ answer, result }) => {
      expect(getDateFormattedResponse(answer)).toStrictEqual(result);
    });
  });

  describe('getTimeRangeResponse', () => {
    const validAnswer = {
      value: {
        from: {
          hour: '0',
          minute: '0',
        },
        to: {
          hour: '14',
          minute: '00',
        },
      },
    };
    const skippedAnswer = {
      value: null,
    };
    const invalidValue = null;
    test.each`
      answer           | result                            | description
      ${validAnswer}   | ${{ from: '00:00', to: '14:00' }} | ${JSON.stringify(validAnswer)}
      ${skippedAnswer} | ${{ from: '', to: '' }}           | ${'empty values when skipped or hidden'}
      ${invalidValue}  | ${{ from: '', to: '' }}           | ${'empty values when invalid'}
    `('should return "$result" when $description', ({ answer, result }) => {
      expect(getTimeRangeResponse(answer)).toStrictEqual(result);
    });
  });
});

import {
  createArrayForSlider,
  getDateFormattedResponse,
  getTimeRangeResponse,
  getActivityWithLatestAnswer,
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

  describe('getActivityWithLatestAnswer', () => {
    const expected1 = { id: 3, lastAnswerDate: '2024-03-20T16:45:16.011110' };
    const activities1 = [
      { id: 1, lastAnswerDate: '2024-02-14T16:23:15.082820' },
      {
        id: 2,
        lastAnswerDate: '2024-03-20T16:44:10.099980',
      },
      expected1,
      {
        id: 4,
        lastAnswerDate: '2024-01-20T10:40:16.011110',
      },
    ];
    const expected2 = { id: 2, lastAnswerDate: '2024-03-20T16:44:10.099980' };
    const activities2 = [
      { id: 1, lastAnswerDate: '2024-02-14T16:23:15.082820' },
      expected2,
      { id: 3, lastAnswerDate: '2024-03-20T16:44:10.099980' },
      {
        id: 4,
        lastAnswerDate: '2024-01-20T10:40:16.011110',
      },
    ];
    const activities3 = [
      { id: 1, lastAnswerDate: null },
      {
        id: 2,
        lastAnswerDate: null,
      },
    ];
    const expected4 = { id: 1, lastAnswerDate: '2024-02-14T16:23:15.082820' };
    const activities4 = [expected4];

    test.each`
      activities     | expected     | description
      ${[]}          | ${null}      | ${'should return null when activities array is empty'}
      ${activities1} | ${expected1} | ${'should return the activity with the latest answer date'}
      ${activities2} | ${expected2} | ${'should return the first activity with the latest answer date if there are multiple'}
      ${activities3} | ${null}      | ${'should return null if all activities have null lastAnswerDate'}
      ${activities4} | ${expected4} | ${'should return the only activity if there is only one activity with a non-null lastAnswerDate'}
    `('$description', ({ activities, expected }) => {
      expect(getActivityWithLatestAnswer(activities)).toEqual(expected);
    });
  });
});

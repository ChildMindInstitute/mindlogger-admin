import {
  createArrayForSlider,
  getDateFormattedResponse,
  getTimeRangeResponse,
  getEntityWithLatestAnswer,
  getConcatenatedEntities,
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
    const emptyValueToNull = {
      value: {
        from: {
          hour: '0',
          minute: '0',
        },
        to: null,
      },
    };
    const emptyValueFromNull = {
      value: {
        from: null,
        to: {
          hour: '14',
          minute: '00',
        },
      },
    };
    const emptyValueFromNullToNull = {
      value: {
        from: null,
        to: null,
      },
    };
    test.each`
      answer                      | result                            | description
      ${validAnswer}              | ${{ from: '00:00', to: '14:00' }} | ${JSON.stringify(validAnswer)}
      ${skippedAnswer}            | ${{ from: '', to: '' }}           | ${'empty values when skipped or hidden'}
      ${invalidValue}             | ${{ from: '', to: '' }}           | ${'empty values when invalid'}
      ${emptyValueToNull}         | ${{ from: '00:00', to: '' }}      | ${'partially filled in when "to" is null'}
      ${emptyValueFromNull}       | ${{ from: '', to: '14:00' }}      | ${'partially filled in when "from" is null'}
      ${emptyValueFromNullToNull} | ${{ from: '', to: '' }}           | ${'empty values when "from" and "to" are null'}
    `('should return "$result" when $description', ({ answer, result }) => {
      expect(getTimeRangeResponse(answer)).toStrictEqual(result);
    });
  });

  describe('getEntityWithLatestAnswer', () => {
    const expected1 = { id: 3, lastAnswerDate: '2024-03-20T16:45:16.011110' };
    const entities1 = [
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
    const sameAnswerDateEntity = { id: 2, lastAnswerDate: '2024-03-20T16:44:10.099980' };
    const entities2 = [
      { id: 1, lastAnswerDate: '2024-02-14T16:23:15.082820' },
      sameAnswerDateEntity,
      { ...sameAnswerDateEntity, id: 3 },
      {
        id: 4,
        lastAnswerDate: '2024-01-20T10:40:16.011110',
      },
    ];
    const entities3 = [
      { id: 1, lastAnswerDate: null },
      {
        id: 2,
        lastAnswerDate: null,
      },
    ];
    const expected4 = { id: 1, lastAnswerDate: '2024-02-14T16:23:15.082820' };
    const entities4 = [expected4];

    test.each`
      entities     | expected        | description
      ${[]}        | ${null}         | ${'should return null when entities array is empty'}
      ${entities1} | ${expected1}    | ${'should return the entity with the latest answer date'}
      ${entities2} | ${entities2[2]} | ${'should return the last entity with the latest answer date if there are multiple'}
      ${entities3} | ${null}         | ${'should return null if all entities have null lastAnswerDate'}
      ${entities4} | ${expected4}    | ${'should return the only entity if there is only one entity with a non-null lastAnswerDate'}
    `('$description', ({ entities, expected }) => {
      expect(getEntityWithLatestAnswer(entities)).toEqual(expected);
    });
  });

  describe('getConcatenatedEntities', () => {
    const entities1 = {
      activities: [{ id: 1, name: 'Activity 1' }],
      flows: [{ id: 2, description: 'Flow 1' }],
    };

    const expected1 = [
      { id: 1, name: 'Activity 1', isFlow: false },
      { id: 2, description: 'Flow 1', isFlow: true },
    ];

    const entities2 = {
      activities: [{ id: 3, name: 'Activity 3' }],
      flows: [{ id: 4, description: 'Flow 2' }],
    };

    const expected2 = [
      { id: 3, name: 'Activity 3', isFlow: false },
      { id: 4, description: 'Flow 2', isFlow: true },
    ];

    const entities3 = {
      activities: [],
      flows: [],
    };

    const entities4 = {
      activities: [{ id: 5, name: 'Activity 5' }],
      flows: [],
    };

    const expected4 = [{ id: 5, name: 'Activity 5', isFlow: false }];

    test.each`
      input        | expected     | description
      ${entities1} | ${expected1} | ${'should return concatenated entities with one activity and one flow'}
      ${entities2} | ${expected2} | ${'should return concatenated entities with different activities and flows'}
      ${entities3} | ${[]}        | ${'should return empty array if activities and flows are empty'}
      ${entities4} | ${expected4} | ${'should return the only entity if there is only one activity'}
    `('$description', ({ input, expected }) => {
      expect(getConcatenatedEntities(input)).toEqual(expected);
    });
  });
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ItemOption, SingleMultiSelectionSliderAnswer } from '../../RespondentData.types';
import {
  mapIdToValue,
  reduceToAnswerMap,
  shiftAnswerValues,
  handleSlider,
  handleSliderRows,
  handleSingleOrMultipleSelection,
  handlePerRowSelection,
} from './compareActivityItem';

describe('shiftAnswerValues', () => {
  test('should increment defined numeric values by 1', () => {
    const answers = [
      { answer: { value: 2, text: null }, date: '2023-09-17T12:00:01.162083' },
      { answer: { value: 5, text: null }, date: '2023-09-18T12:00:01.162083' },
      { answer: { value: 0, text: null }, date: '2023-09-19T12:00:01.162083' },
    ];
    const expected = [
      { answer: { value: 3, text: null }, date: '2023-09-17T12:00:01.162083' },
      { answer: { value: 6, text: null }, date: '2023-09-18T12:00:01.162083' },
      { answer: { value: 1, text: null }, date: '2023-09-19T12:00:01.162083' },
    ];
    const result = shiftAnswerValues(answers);
    expect(result).toEqual(expected);
  });

  test('should not change null values', () => {
    const answers = [{ answer: { value: null, text: null }, date: '2023-09-20T12:00:01.162083' }];
    const expected = [{ answer: { value: null, text: null }, date: '2023-09-20T12:00:01.162083' }];
    const result = shiftAnswerValues(answers);
    expect(result).toEqual(expected);
  });
});

describe('mapIdToValue', () => {
  test('should map ids to values correctly', () => {
    const options = [
      { id: 'a', text: 'a_text', value: 1 },
      { id: 'b', text: 'b_text', value: 2 },
      { id: 'c', text: 'c_text', value: 3 },
    ];
    const expected = { a: 1, b: 2, c: 3 };
    const result = mapIdToValue(options);
    expect(result).toEqual(expected);
  });

  test('should handle an empty array', () => {
    const options: ItemOption[] = [];
    const expected = {};
    const result = mapIdToValue(options);
    expect(result).toEqual(expected);
  });

  test('should handle special values such as null and undefined', () => {
    const options = [
      { id: 'a', value: null },
      { id: 'b', value: undefined },
      { id: 'c', value: 0 },
    ];
    const expected = { a: null, b: undefined, c: 0 };
    const result = mapIdToValue(options);
    expect(result).toEqual(expected);
  });
});

describe('reduceToAnswerMap', () => {
  test('should map values to answers correctly with unique values', () => {
    const answers = [
      { answer: { value: 1, text: null }, date: '2023-09-17T12:00:01.162083' },
      { answer: { value: 2, text: null }, date: '2023-09-18T12:00:01.162083' },
      { answer: { value: 3, text: null }, date: '2023-09-19T12:00:01.162083' },
    ];
    const expected = {
      1: { answer: { value: 1, text: null }, date: '2023-09-17T12:00:01.162083' },
      2: { answer: { value: 2, text: null }, date: '2023-09-18T12:00:01.162083' },
      3: { answer: { value: 3, text: null }, date: '2023-09-19T12:00:01.162083' },
    };
    const result = reduceToAnswerMap(answers);
    expect(result).toEqual(expected);
  });

  test('should ignore answers with null or undefined values', () => {
    const answers = [
      { answer: { value: null, text: null }, date: '2023-09-17T12:00:01.162083' },
      { answer: { value: undefined, text: null }, date: '2023-09-18T12:00:01.162083' },
      { answer: { value: 5, text: null }, date: '2023-09-19T12:00:01.162083' },
    ];
    const expected = {
      5: { answer: { value: 5, text: null }, date: '2023-09-19T12:00:01.162083' },
    };
    const result = reduceToAnswerMap(answers);
    expect(result).toEqual(expected);
  });

  test('should return an empty when input is empty', () => {
    const answers: SingleMultiSelectionSliderAnswer[] = [];
    const expected = {};
    const result = reduceToAnswerMap(answers);
    expect(result).toEqual(expected);
  });
});

describe('compare activity item cases', () => {
  test('handleSingleOrMultipleSelection', () => {
    const prevActivityItem = {
      activityItem: {
        id: '3b466d32-2ac7-488f-bfd3-df209938863c',
        name: 'Item1',
        question: {
          en: 'ss',
        },
        responseType: 'singleSelect',
        responseValues: {
          options: [
            {
              id: 'bc9c9d55-8e97-4d6f-98a8-34e931c044ff',
              text: 'text 2',
              value: 0,
            },
            {
              id: '8ec1fc59-4cf6-462f-8232-f7b6c39b8f92',
              text: 'text 1',
              value: 1,
            },
          ],
        },
      },
      answers: [
        {
          answer: {
            value: 0,
          },
          date: '2024-04-26T12:46:38.061000',
        },
      ],
    };
    const formattedActivityItemAnswers = {
      activityItem: {
        id: '3b466d32-2ac7-488f-bfd3-df209938863c',
        name: 'Item1',
        question: {
          en: 'ss updated',
        },
        responseType: 'singleSelect',
        responseValues: {
          options: [
            {
              id: '8ec1fc59-4cf6-462f-8232-f7b6c39b8f92',
              text: 'text 1',
              value: 1,
            },
            {
              id: '809afd50-c7b1-4144-8ddd-1fe2b2f59e7f',
              text: 'new text 2',
              value: 0,
            },
          ],
        },
      },
      answers: [
        {
          answer: {
            value: 0,
          },
          date: '2024-04-26T12:48:50.599000',
        },
      ],
    };

    const result = handleSingleOrMultipleSelection(prevActivityItem, formattedActivityItemAnswers);
    expect(result).toEqual({
      activityItem: {
        id: '3b466d32-2ac7-488f-bfd3-df209938863c',
        name: 'Item1',
        question: { en: 'ss updated' },
        responseType: 'singleSelect',
        responseValues: {
          options: [
            { id: 'bc9c9d55-8e97-4d6f-98a8-34e931c044ff', text: 'text 2', value: 1 },
            { id: '8ec1fc59-4cf6-462f-8232-f7b6c39b8f92', text: 'text 1', value: 2 },
            { id: '809afd50-c7b1-4144-8ddd-1fe2b2f59e7f', text: 'new text 2', value: 0 },
          ],
        },
      },
      answers: [
        { answer: { value: 1 }, date: '2024-04-26T12:46:38.061000' },
        { answer: { value: 0 }, date: '2024-04-26T12:48:50.599000' },
      ],
    });
  });

  test('handleSlider', () => {
    const prevActivityItem = {
      activityItem: {
        id: 'bee868b9-76d6-40fd-9ec5-4753f162db66',
        name: 'Item1',
        question: {
          en: 'slider',
        },
        responseType: 'slider',
        responseValues: {
          options: [
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-0',
              text: 0,
              value: 0,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-1',
              text: 1,
              value: 1,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-2',
              text: 2,
              value: 2,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-3',
              text: 3,
              value: 3,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-4',
              text: 4,
              value: 4,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-5',
              text: 5,
              value: 5,
            },
          ],
        },
      },
      answers: [
        {
          answer: {
            value: 3,
            text: null,
          },
          date: '2024-04-26T12:50:21.407000',
        },
      ],
    };
    const formattedActivityItemAnswers = {
      activityItem: {
        id: 'bee868b9-76d6-40fd-9ec5-4753f162db66',
        name: 'Item1',
        question: {
          en: 'slider',
        },
        responseType: 'slider',
        responseValues: {
          options: [
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-1',
              text: 1,
              value: 1,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-2',
              text: 2,
              value: 2,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-3',
              text: 3,
              value: 3,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-4',
              text: 4,
              value: 4,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-5',
              text: 5,
              value: 5,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-6',
              text: 6,
              value: 6,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-7',
              text: 7,
              value: 7,
            },
          ],
        },
      },
      answers: [
        {
          answer: {
            value: 6,
            text: null,
          },
          date: '2024-04-26T12:51:10.171000',
        },
      ],
    };
    const currActivityItem = {
      activityItem: {
        question: {
          en: 'slider',
        },
        responseType: 'slider',
        responseValues: {
          minLabel: 'min',
          maxLabel: 'max',
          minValue: 1,
          maxValue: 7,
          type: 'slider',
        },
        config: {},
        name: 'Item1',
        id: 'bee868b9-76d6-40fd-9ec5-4753f162db66',
        order: 1,
      },
      answer: {
        value: 6,
        text: null,
      },
    };

    const result = handleSlider(prevActivityItem, formattedActivityItemAnswers, currActivityItem);
    expect(result).toEqual({
      activityItem: {
        id: 'bee868b9-76d6-40fd-9ec5-4753f162db66',
        name: 'Item1',
        question: {
          en: 'slider',
        },
        responseType: 'slider',
        responseValues: {
          options: [
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-0',
              text: 0,
              value: 0,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-1',
              text: 1,
              value: 1,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-2',
              text: 2,
              value: 2,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-3',
              text: 3,
              value: 3,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-4',
              text: 4,
              value: 4,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-5',
              text: 5,
              value: 5,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-6',
              text: 6,
              value: 6,
            },
            {
              id: 'bee868b9-76d6-40fd-9ec5-4753f162db66-7',
              text: 7,
              value: 7,
            },
          ],
        },
      },
      answers: [
        {
          answer: {
            text: null,
            value: 3,
          },
          date: '2024-04-26T12:50:21.407000',
        },
        {
          answer: {
            text: null,
            value: 6,
          },
          date: '2024-04-26T12:51:10.171000',
        },
      ],
    });
  });

  test('handlePerRowSelection', () => {
    const previousActivityItem = {
      activityItem: {
        id: 'ef276f93-ec56-40a1-a42d-18d21f5df3e4',
        name: 'Item1',
        question: {
          en: 'single selection per row',
        },
        responseType: 'singleSelectRows',
        responseValues: {
          type: 'singleSelectRows',
          rows: [
            {
              id: 'd91e252c-e233-4644-888a-48e8eeff5b62',
              rowName: 'row 1',
            },
            {
              id: 'd91e252c-e233-4644-888a-48e8eeff5b62',
              rowName: 'row 1 (upd)',
            },
            {
              id: '914ea1e1-a334-4414-bb44-53f1e2e4c31d',
              rowName: 'row 2',
            },
          ],
          options: [
            {
              id: '59871f71-c8df-4fb2-80bf-e334f69097cc',
              text: 'option 1',
            },
            {
              id: '4bf7cf33-700e-4576-90a2-12f4183b2c30',
              text: 'option 2',
            },
            {
              id: 'd0d277cc-67f3-4988-943d-c2241b3bff10',
              text: 'new option',
            },
          ],
          dataMatrix: null,
        },
      },
      answers: {
        'row 1': [
          {
            answer: {
              value: 'option 2',
              text: null,
            },
            date: '2024-05-06T12:15:53.291000',
          },
        ],
        'row 1 (upd)': [
          {
            answer: {
              value: 'option 1',
              text: null,
            },
            date: '2024-05-06T12:17:30.658000',
          },
        ],
        'row 2': [
          {
            answer: {
              value: 'new option',
              text: null,
            },
            date: '2024-05-06T12:17:30.658000',
          },
        ],
      },
    };
    const formattedActivityItemAnswers = {
      activityItem: {
        id: 'ef276f93-ec56-40a1-a42d-18d21f5df3e4',
        name: 'Item1',
        question: {
          en: 'updated displayed content',
        },
        responseType: 'singleSelectRows',
        responseValues: {
          type: 'singleSelectRows',
          rows: [
            {
              id: 'd91e252c-e233-4644-888a-48e8eeff5b62',
              rowName: 'row 1 (upd)',
            },
            {
              id: '914ea1e1-a334-4414-bb44-53f1e2e4c31d',
              rowName: 'row 2',
            },
          ],
          options: [
            {
              id: '59871f71-c8df-4fb2-80bf-e334f69097cc',
              text: 'option 1',
            },
            {
              id: '4bf7cf33-700e-4576-90a2-12f4183b2c30',
              text: 'option 2',
            },
            {
              id: 'd0d277cc-67f3-4988-943d-c2241b3bff10',
              text: 'new option',
            },
          ],
          dataMatrix: null,
        },
      },
      answers: {
        'row 1 (upd)': [
          {
            answer: {
              value: 'option 1',
              text: null,
            },
            date: '2024-05-06T12:17:30.658000',
          },
        ],
        'row 2': [
          {
            answer: {
              value: 'new option',
              text: null,
            },
            date: '2024-05-06T12:17:30.658000',
          },
        ],
      },
    };

    const result = handlePerRowSelection(previousActivityItem, formattedActivityItemAnswers);
    expect(result).toEqual({
      activityItem: {
        id: 'ef276f93-ec56-40a1-a42d-18d21f5df3e4',
        name: 'Item1',
        question: {
          en: 'updated displayed content',
        },
        responseType: 'singleSelectRows',
        responseValues: {
          dataMatrix: null,
          options: [
            {
              id: '59871f71-c8df-4fb2-80bf-e334f69097cc',
              text: 'option 1',
            },
            {
              id: '4bf7cf33-700e-4576-90a2-12f4183b2c30',
              text: 'option 2',
            },
            {
              id: 'd0d277cc-67f3-4988-943d-c2241b3bff10',
              text: 'new option',
            },
          ],
          rows: [
            {
              id: 'd91e252c-e233-4644-888a-48e8eeff5b62',
              rowName: 'row 1',
            },
            {
              id: 'd91e252c-e233-4644-888a-48e8eeff5b62',
              rowName: 'row 1 (upd)',
            },
            {
              id: '914ea1e1-a334-4414-bb44-53f1e2e4c31d',
              rowName: 'row 2',
            },
          ],
          type: 'singleSelectRows',
        },
      },
      answers: {
        'row 1': [
          {
            answer: {
              text: null,
              value: 'option 2',
            },
            date: '2024-05-06T12:15:53.291000',
          },
        ],
        'row 1 (upd)': [
          {
            answer: {
              text: null,
              value: 'option 1',
            },
            date: '2024-05-06T12:17:30.658000',
          },
          {
            answer: {
              text: null,
              value: 'option 1',
            },
            date: '2024-05-06T12:17:30.658000',
          },
        ],
        'row 2': [
          {
            answer: {
              text: null,
              value: 'new option',
            },
            date: '2024-05-06T12:17:30.658000',
          },
          {
            answer: {
              text: null,
              value: 'new option',
            },
            date: '2024-05-06T12:17:30.658000',
          },
        ],
      },
    });
  });

  test('handleSliderRows', () => {
    const prevActivityItem = {
      activityItem: {
        id: '6c1e500a-908d-4b8c-9890-ec396c257c7f',
        name: 'Item1',
        question: {
          en: 'slider rows',
        },
        responseType: 'sliderRows',
        responseValues: {
          type: 'sliderRows',
          rows: [
            {
              minValue: 1,
              maxValue: 5,
              id: '78eef744-31df-4adc-aa35-0b2d7c228d93',
              label: 'label',
            },
            {
              minValue: 0,
              maxValue: 10,
              id: '3fa58ae0-8d4f-427c-af2c-93c71e18187b',
              label: 'label 2',
            },
          ],
        },
      },
      answers: {
        '78eef744-31df-4adc-aa35-0b2d7c228d93': [
          {
            answer: {
              value: 1,
              text: null,
            },
            date: '2024-04-25T12:54:06.841000',
          },
        ],
        '3fa58ae0-8d4f-427c-af2c-93c71e18187b': [
          {
            answer: {
              value: 9,
              text: null,
            },
            date: '2024-04-25T12:54:06.841000',
          },
        ],
      },
    };
    const formattedActivityItemAnswers = {
      activityItem: {
        id: '6c1e500a-908d-4b8c-9890-ec396c257c7f',
        name: 'Item1',
        question: {
          en: 'updated slider rows',
        },
        responseType: 'sliderRows',
        responseValues: {
          type: 'sliderRows',
          rows: [
            {
              minValue: 0,
              maxValue: 10,
              id: '78eef744-31df-4adc-aa35-0b2d7c228d93',
              label: 'label',
            },
            {
              minValue: 1,
              maxValue: 5,
              id: '35d331af-180c-43b1-83e1-7a6f34d2fd76',
              label: 'new label 2',
            },
          ],
        },
      },
      answers: {
        '78eef744-31df-4adc-aa35-0b2d7c228d93': [
          {
            answer: {
              value: 10,
              text: null,
            },
            date: '2024-04-26T12:54:06.841000',
          },
        ],
        '35d331af-180c-43b1-83e1-7a6f34d2fd76': [
          {
            answer: {
              value: 4,
              text: null,
            },
            date: '2024-04-26T12:54:06.841000',
          },
        ],
      },
    };
    const currActivityItem = {
      activityItem: {
        question: {
          en: 'slider rows',
        },
        responseType: 'sliderRows',
        responseValues: {
          type: 'sliderRows',
          rows: [
            {
              minLabel: 'min',
              maxLabel: 'max',
              minValue: 0,
              maxValue: 10,
              id: '78eef744-31df-4adc-aa35-0b2d7c228d93',
              label: 'label',
            },
            {
              minLabel: 'min',
              maxLabel: 'max',
              minValue: 1,
              maxValue: 5,
              id: '35d331af-180c-43b1-83e1-7a6f34d2fd76',
              label: 'new label 2',
            },
          ],
        },
        name: 'Item1',
        id: '6c1e500a-908d-4b8c-9890-ec396c257c7f',
      },
    };

    const result = handleSliderRows(
      prevActivityItem,
      formattedActivityItemAnswers,
      currActivityItem,
    );
    expect(result).toEqual({
      activityItem: {
        id: '6c1e500a-908d-4b8c-9890-ec396c257c7f',
        name: 'Item1',
        question: { en: 'updated slider rows' },
        responseType: 'sliderRows',
        responseValues: {
          rows: [
            {
              id: '78eef744-31df-4adc-aa35-0b2d7c228d93',
              label: 'label',
              minLabel: 'min',
              maxLabel: 'max',
              maxValue: 10,
              minValue: 0,
            },
            {
              id: '3fa58ae0-8d4f-427c-af2c-93c71e18187b',
              label: 'label 2',
              maxValue: 10,
              minValue: 0,
            },
            {
              id: '35d331af-180c-43b1-83e1-7a6f34d2fd76',
              label: 'new label 2',
              minLabel: 'min',
              maxLabel: 'max',
              maxValue: 5,
              minValue: 1,
            },
          ],
        },
      },
      answers: {
        '35d331af-180c-43b1-83e1-7a6f34d2fd76': [
          { answer: { text: null, value: 4 }, date: '2024-04-26T12:54:06.841000' },
        ],
        '3fa58ae0-8d4f-427c-af2c-93c71e18187b': [
          {
            answer: {
              text: null,
              value: 9,
            },
            date: '2024-04-25T12:54:06.841000',
          },
        ],
        '78eef744-31df-4adc-aa35-0b2d7c228d93': [
          { answer: { text: null, value: 1 }, date: '2024-04-25T12:54:06.841000' },
          {
            answer: {
              text: null,
              value: 10,
            },
            date: '2024-04-26T12:54:06.841000',
          },
        ],
      },
    });
  });
});

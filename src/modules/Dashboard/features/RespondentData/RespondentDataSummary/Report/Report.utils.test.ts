import { ItemResponseType } from 'shared/consts';
import { SingleAndMultipleSelectItemResponseValues, SingleSelectItem } from 'shared/state';
import { ActivityItemAnswer } from 'shared/types';

import {
  compareActivityItem,
  getDateISO,
  getSliderOptions,
  isAnswerTypeCorrect,
  isValueDefined,
  formatActivityItemAnswers,
} from './Report.utils';

describe('isValueDefined', () => {
  test.each`
    value                   | expectedOutput | description
    ${'Hello'}              | ${true}        | ${'should return true for a defined string value'}
    ${42}                   | ${true}        | ${'should return true for a defined number value'}
    ${['Value1', 'Value2']} | ${true}        | ${'should return true for an array of defined string values'}
    ${[1, 2, 3]}            | ${true}        | ${'should return true for an array of defined number values'}
    ${''}                   | ${true}        | ${'should return true for an empty string'}
    ${[]}                   | ${true}        | ${'should return true for an empty array'}
    ${0}                    | ${true}        | ${'should return true for zero'}
    ${null}                 | ${false}       | ${'should return false for null'}
    ${undefined}            | ${false}       | ${'should return false for undefined'}
  `('$description', ({ value, expectedOutput }) => {
    const result = isValueDefined(value);
    expect(result).toBe(expectedOutput);
  });
});

describe('isAnswerTypeCorrect', () => {
  test.each`
    answer                  | responseType                          | expectedOutput | description
    ${{ value: 3 }}         | ${ItemResponseType.SingleSelection}   | ${true}        | ${'should return true for a correct single selection/slider answer'}
    ${{ value: 'string' }}  | ${ItemResponseType.SingleSelection}   | ${false}       | ${'should return false for an incorrect single selection/slider answer'}
    ${{ value: [1, 2, 3] }} | ${ItemResponseType.MultipleSelection} | ${true}        | ${'should return true for a correct multiple selection answer'}
    ${{ value: 'string' }}  | ${ItemResponseType.MultipleSelection} | ${false}       | ${'should return false for an incorrect multiple selection answer'}
    ${'string'}             | ${ItemResponseType.Text}              | ${true}        | ${'should return true for a correct text answer'}
    ${{ value: 'string' }}  | ${ItemResponseType.Text}              | ${false}       | ${'should return false for an incorrect text answer'}
  `('$description', ({ answer, responseType, expectedOutput }) => {
    const result = isAnswerTypeCorrect(answer, responseType);
    expect(result).toBe(expectedOutput);
  });
});

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

const expectedOptions1 = [
  { id: 'slider1-0', text: 0, value: 0 },
  { id: 'slider1-1', text: 1, value: 1 },
  { id: 'slider1-2', text: 2, value: 2 },
  { id: 'slider1-3', text: 3, value: 3 },
];
const expectedOptions2 = [{ id: 'slider2-1', text: 1, value: 1 }];

describe('getSliderOptions', () => {
  test.each`
    minValue | maxValue | itemId       | expectedOptions     | description
    ${0}     | ${3}     | ${'slider1'} | ${expectedOptions1} | ${'should create slider options [0, 3]'}
    ${1}     | ${1}     | ${'slider2'} | ${expectedOptions2} | ${'should create slider options for a single value'}
  `('$description', ({ minValue, maxValue, itemId, expectedOptions }) => {
    const result = getSliderOptions({ minValue, maxValue }, itemId);
    expect(result).toEqual(expectedOptions);
  });
});

const answerDate = '2023-11-06T13:12:09.736000';

const commonSingleSelectionConfig = {
  removeBackButton: false,
  skippableItem: false,
  randomizeOptions: false,
  timer: 0,
  addScores: false,
  setAlerts: false,
  addTooltip: false,
  setPalette: false,
  addTokens: null,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
  autoAdvance: false,
};

const prevActivityItem = {
  activityItem: {
    id: 'e77acf6b-0938-45c8-a254-da620941daf3',
    name: 'Item1',
    question: {
      en: 'Question before update',
    },
    responseType: ItemResponseType.SingleSelection,
    responseValues: {
      options: [
        {
          id: '88f88333-c5fb-4e1e-8a20-8c4bbca192e1',
          text: 'SS 2',
          value: 0,
        },
        {
          id: '4669350b-2435-4c3a-b180-cbb8245df264',
          text: 'SS 1',
          value: 1,
        },
      ],
    },
  },
  answers: [
    {
      answer: {
        value: 1,
        text: null,
      },
      date: '2023-11-06T11:06:46.710000',
    },
  ],
};

const currActivityItem = {
  activityItem: {
    question: {
      en: 'Question after update',
    },
    responseType: ItemResponseType.SingleSelection,
    responseValues: {
      options: [
        {
          id: '0be0aeba-058a-4df4-aa7c-296a1d8211b3',
          text: 'SS 3 (new)',
          value: 2,
        },
        {
          id: '88f88333-c5fb-4e1e-8a20-8c4bbca192e1',
          text: 'SS 2 (updated)',
          value: 1,
        },
        {
          id: '4669350b-2435-4c3a-b180-cbb8245df264',
          text: 'SS 1',
          value: 0,
        },
      ],
    } as SingleAndMultipleSelectItemResponseValues,
    config: commonSingleSelectionConfig,
    name: 'Item1',
    isHidden: false,
    allowEdit: true,
    id: 'e77acf6b-0938-45c8-a254-da620941daf3',
    order: 1,
  } as SingleSelectItem,
  answer: {
    value: 2,
    text: null,
  },
  items: [
    {
      question: {
        en: 'Question after update',
      },
      responseType: ItemResponseType.SingleSelection,
      responseValues: {
        paletteName: null,
        options: [
          {
            id: '0be0aeba-058a-4df4-aa7c-296a1d8211b3',
            text: 'SS 3 (new)',
            value: 2,
          },
          {
            id: '88f88333-c5fb-4e1e-8a20-8c4bbca192e1',
            text: 'SS 2 (updated)',
            value: 1,
          },
          {
            id: '4669350b-2435-4c3a-b180-cbb8245df264',
            text: 'SS 1',
            value: 0,
          },
        ],
      },
      config: commonSingleSelectionConfig,
      name: 'Item1',
      isHidden: false,
      allowEdit: true,
      id: 'e77acf6b-0938-45c8-a254-da620941daf3',
      order: 1,
    },
  ],
};

const expectedResult = {
  activityItem: {
    id: 'e77acf6b-0938-45c8-a254-da620941daf3',
    name: 'Item1',
    question: {
      en: 'Question after update',
    },
    responseType: ItemResponseType.SingleSelection,
    responseValues: {
      options: [
        {
          id: '88f88333-c5fb-4e1e-8a20-8c4bbca192e1',
          text: 'SS 2 (updated)',
          value: 1,
        },
        {
          id: '4669350b-2435-4c3a-b180-cbb8245df264',
          text: 'SS 1',
          value: 2,
        },
        {
          id: '0be0aeba-058a-4df4-aa7c-296a1d8211b3',
          text: 'SS 3 (new)',
          value: 0,
        },
      ],
    },
  },
  answers: [
    {
      answer: {
        value: 2,
        text: null,
      },
      date: '2023-11-06T11:06:46.710000',
    },
    {
      answer: {
        value: 0,
        text: null,
      },
      date: answerDate,
    },
  ],
};

describe('compareActivityItem', () => {
  test('should be updated question and options for activity and added new answer', () => {
    const result = compareActivityItem(prevActivityItem, currActivityItem, answerDate);
    expect(result).toEqual(expectedResult);
  });
});

const currentAnswer: ActivityItemAnswer = {
  activityItem: {
    question: {
      en: 'SS',
    },
    responseType: ItemResponseType.SingleSelection,
    responseValues: {
      options: [
        {
          id: '0be0aeba-058a-4df4-aa7c-296a1d8211b3',
          text: 'SS 3',
          value: 2,
        },
        {
          id: '88f88333-c5fb-4e1e-8a20-8c4bbca192e1',
          text: 'SS 2',
          value: 1,
        },
        {
          id: '4669350b-2435-4c3a-b180-cbb8245df264',
          text: 'SS 1',
          value: 0,
        },
      ],
    },
    config: commonSingleSelectionConfig,
    name: 'Item1',
    isHidden: false,
    allowEdit: true,
    id: 'e77acf6b-0938-45c8-a254-da620941daf3',
    order: 1,
  },
  answer: {
    value: 1,
    text: null,
  },
};

const formatActivityItemAnswersResult = {
  activityItem: {
    id: 'e77acf6b-0938-45c8-a254-da620941daf3',
    name: 'Item1',
    question: {
      en: 'SS',
    },
    responseType: ItemResponseType.SingleSelection,
    responseValues: {
      options: [
        {
          id: '0be0aeba-058a-4df4-aa7c-296a1d8211b3',
          text: 'SS 3',
          value: 0,
        },
        {
          id: '88f88333-c5fb-4e1e-8a20-8c4bbca192e1',
          text: 'SS 2',
          value: 1,
        },
        {
          id: '4669350b-2435-4c3a-b180-cbb8245df264',
          text: 'SS 1',
          value: 2,
        },
      ],
    },
  },
  answers: [
    {
      answer: {
        value: 1,
        text: null,
      },
      date: answerDate,
    },
  ],
};

describe('formatActivityItemAnswers', () => {
  test('activity and answers should be formatted to FormattedResponse type', () => {
    const result = formatActivityItemAnswers(currentAnswer, answerDate);
    expect(result).toEqual(formatActivityItemAnswersResult);
  });
});

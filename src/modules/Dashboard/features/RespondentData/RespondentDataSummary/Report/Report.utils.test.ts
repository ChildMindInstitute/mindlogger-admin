// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ItemResponseType } from 'shared/consts';

import {
  getDateISO,
  getSliderOptions,
  isAnswerTypeCorrect,
  isValueDefined,
  getFormattedResponses,
  getIdentifiers,
  getOptionsMapper,
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

const activityResponses = [
  {
    decryptedAnswer: [
      {
        activityItem: {
          question: {
            en: 'SS',
          },
          responseType: 'singleSelect',
          responseValues: {
            options: [
              {
                id: 'ba194132-91a7-49ee-a8ce-be97c7261ff0',
                text: 'SS 1',
                isHidden: false,
                value: 1,
              },
              {
                id: 'ac6bcb6b-d645-49f2-ba24-a8a60c82f303',
                text: 'SS 2',
                isHidden: false,
                value: 0,
              },
            ],
          },
          name: 'Item1',
          isHidden: false,
          allowEdit: true,
          id: 'b3825743-f796-4551-9057-662797ccd8c3',
          order: 1,
        },
        answer: {
          value: 0,
          text: null,
        },
      },
      {
        activityItem: {
          question: {
            en: 'MS',
          },
          responseType: 'multiSelect',
          responseValues: {
            options: [
              {
                id: '727f9f6d-ff0d-47f0-94e3-bc16d72024ff',
                text: 'MS 2',
                isHidden: false,
                value: 1,
              },
              {
                id: '76286f9c-1ffe-43f2-8155-362bcf66dd13',
                text: 'MS 1',
                isHidden: false,
                value: 0,
              },
            ],
          },
          config: {},
          name: 'Item2',
          isHidden: false,
          allowEdit: true,
          id: 'dfeb5edb-d797-4b5f-be40-05fea8de4c22',
          order: 2,
        },
        answer: {
          value: [0],
          text: null,
        },
      },
      {
        activityItem: {
          question: {
            en: 'Text',
          },
          responseType: 'text',
          config: {
            responseDataIdentifier: false,
            isIdentifier: null,
          },
          name: 'Item3',
          isHidden: false,
          allowEdit: true,
          id: '69a98366-8627-4c9b-9973-5c16416695b8',
          order: 3,
        },
        answer: 'Text 1',
      },
      {
        activityItem: {
          question: {
            en: 'Time',
          },
          responseType: 'time',
          responseValues: null,
          config: {},
          name: 'Item4',
          isHidden: false,
          allowEdit: true,
          id: '85a332c4-7e47-4d9b-aaf7-b7a01acb98c2',
          order: 4,
        },
        answer: {
          value: {
            hours: 11,
            minutes: 15,
          },
          text: null,
        },
      },
      {
        activityItem: {
          question: {
            en: 'Slider',
          },
          responseType: 'slider',
          responseValues: {
            minLabel: 'Min',
            maxLabel: 'Max',
            minValue: 0,
            maxValue: 5,
          },
          config: {},
          name: 'Item5',
          isHidden: false,
          allowEdit: true,
          id: '2613ae84-7282-46e3-98e1-344c6fcbfe53',
          order: 5,
        },
        answer: {
          value: 2,
          text: null,
        },
      },
    ],
    answerId: 'b7fda40d-e3cb-4883-a20f-4c1c905b27e8',
    version: '1.1.0',
    startDatetime: '2024-01-22T20:07:05.665000',
    endDatetime: '2024-01-22T20:07:22.782000',
    subscaleSetting: null,
  },
  {
    decryptedAnswer: [
      {
        activityItem: {
          question: {
            en: 'SS (updated)',
          },
          responseType: 'singleSelect',
          responseValues: {
            options: [
              {
                id: 'ba194132-91a7-49ee-a8ce-be97c7261ff0',
                text: 'SS 2 (updated)',
                isHidden: false,
                value: 1,
              },
              {
                id: 'ac6bcb6b-d645-49f2-ba24-a8a60c82f303',
                text: 'SS 1',
                isHidden: false,
                value: 0,
              },
            ],
          },
          config: {},
          name: 'Item1',
          isHidden: false,
          allowEdit: true,
          id: 'b3825743-f796-4551-9057-662797ccd8c3',
          order: 1,
        },
        answer: {
          value: 1,
          text: null,
        },
      },
      {
        activityItem: {
          question: {
            en: 'MS --> SS',
          },
          responseType: 'singleSelect',
          responseValues: {
            options: [
              {
                id: 'a14634c9-d39c-4f05-9197-43b9330bfd06',
                text: '2',
                isHidden: false,
                value: 1,
              },
              {
                id: '196e2bfa-5216-4cbd-b4b0-97917db4243d',
                text: '1',
                isHidden: false,
                value: 0,
              },
            ],
          },
          config: {},
          name: 'Item2',
          isHidden: false,
          allowEdit: true,
          id: 'dfeb5edb-d797-4b5f-be40-05fea8de4c22',
          order: 2,
        },
        answer: {
          value: 1,
          text: null,
        },
      },
      {
        activityItem: {
          question: {
            en: 'Text',
          },
          responseType: 'text',
          config: {
            responseDataIdentifier: false,
            isIdentifier: null,
          },
          name: 'Item3',
          isHidden: false,
          allowEdit: true,
          id: '69a98366-8627-4c9b-9973-5c16416695b8',
          order: 3,
        },
        answer: 'Text 2',
      },
      {
        activityItem: {
          question: {
            en: 'Time',
          },
          responseType: 'time',
          responseValues: null,
          config: {},
          name: 'Item4',
          isHidden: false,
          allowEdit: true,
          id: '85a332c4-7e47-4d9b-aaf7-b7a01acb98c2',
          order: 4,
        },
        answer: {
          value: {
            hours: 8,
            minutes: 5,
          },
          text: null,
        },
      },
      {
        activityItem: {
          question: {
            en: 'Slider',
          },
          responseType: 'slider',
          responseValues: {
            minLabel: 'Min',
            maxLabel: 'Max',
            minValue: 0,
            maxValue: 5,
          },
          config: {},
          name: 'Item5',
          isHidden: false,
          allowEdit: true,
          id: '2613ae84-7282-46e3-98e1-344c6fcbfe53',
          order: 5,
        },
        answer: null,
      },
    ],
    answerId: 'e696fa44-be8b-4083-80aa-2ea7e76ec14c',
    version: '1.1.1',
    startDatetime: '2024-01-22T20:08:10.455000',
    endDatetime: '2024-01-22T20:08:18.645000',
    subscaleSetting: null,
  },
  {
    decryptedAnswer: [
      {
        activityItem: {
          question: {
            en: 'SS (updated)',
          },
          responseType: 'singleSelect',
          responseValues: {
            options: [
              {
                id: 'ba194132-91a7-49ee-a8ce-be97c7261ff0',
                text: 'SS 2 (updated)',
                score: 2,
                isHidden: false,
                value: 1,
              },
              {
                id: 'ac6bcb6b-d645-49f2-ba24-a8a60c82f303',
                text: 'SS 1',
                score: 1,
                isHidden: false,
                value: 0,
              },
            ],
          },
          config: {},
          name: 'Item1',
          isHidden: false,
          allowEdit: true,
          id: 'b3825743-f796-4551-9057-662797ccd8c3',
          order: 1,
        },
        answer: {
          value: 0,
          text: null,
        },
      },
      {
        activityItem: {
          question: {
            en: 'MS --> SS',
          },
          responseType: 'singleSelect',
          responseValues: {
            options: [
              {
                id: 'a14634c9-d39c-4f05-9197-43b9330bfd06',
                text: '2',
                score: 2,
                isHidden: false,
                value: 1,
              },
              {
                id: '196e2bfa-5216-4cbd-b4b0-97917db4243d',
                text: '1',
                score: 1,
                isHidden: false,
                value: 0,
              },
            ],
          },
          config: {},
          name: 'Item2',
          isHidden: false,
          allowEdit: true,
          id: 'dfeb5edb-d797-4b5f-be40-05fea8de4c22',
          order: 2,
        },
        answer: {
          value: 1,
          text: null,
        },
      },
      {
        activityItem: {
          question: {
            en: 'Text',
          },
          responseType: 'text',
          config: {
            responseDataIdentifier: false,
            isIdentifier: null,
          },
          name: 'Item3',
          isHidden: false,
          allowEdit: true,
          id: '69a98366-8627-4c9b-9973-5c16416695b8',
          order: 3,
        },
        answer: 'Text 3',
      },
      {
        activityItem: {
          question: {
            en: 'Time',
          },
          responseType: 'time',
          responseValues: null,
          config: {},
          name: 'Item4',
          isHidden: false,
          allowEdit: true,
          id: '85a332c4-7e47-4d9b-aaf7-b7a01acb98c2',
          order: 4,
        },
        answer: null,
      },
      {
        activityItem: {
          question: {
            en: 'Slider',
          },
          responseType: 'slider',
          responseValues: {
            minLabel: 'Min',
            maxLabel: 'Max',
            minValue: 0,
            maxValue: 10,
          },
          config: {},
          name: 'Item5',
          isHidden: false,
          allowEdit: true,
          id: '2613ae84-7282-46e3-98e1-344c6fcbfe53',
          order: 5,
        },
        answer: {
          value: 4,
          text: null,
        },
      },
    ],
    answerId: 'ca2b4d38-0dbd-4344-9d12-42986f1dce4a',
    version: '1.1.2',
    startDatetime: '2024-01-22T20:09:12.424000',
    endDatetime: '2024-01-22T20:09:20.950000',
    subscaleSetting: {
      calculateTotalScore: null,
      subscales: [
        {
          name: 'sum',
          scoring: 'sum',
          items: [
            {
              name: 'Item1',
              type: 'item',
            },
            {
              name: 'Item2',
              type: 'item',
            },
          ],
          subscaleTableData: null,
        },
        {
          name: 'average',
          scoring: 'average',
          items: [
            {
              name: 'Item1',
              type: 'item',
            },
            {
              name: 'Item2',
              type: 'item',
            },
          ],
          subscaleTableData: null,
        },
      ],
      totalScoresTableData: null,
    },
  },
  {
    decryptedAnswer: [
      {
        activityItem: {
          question: {
            en: 'Text',
          },
          responseType: 'text',
          config: {
            responseDataIdentifier: false,
            isIdentifier: null,
          },
          name: 'Item3',
          isHidden: true,
          allowEdit: true,
          id: '69a98366-8627-4c9b-9973-5c16416695b8',
        },
        answer: undefined,
      },
    ],
    answerId: 'da2b4d38-0dbd-4344-9d12-42986f1dce4a',
    version: '1.1.2',
    startDatetime: '2024-01-22T21:09:12.424000',
    endDatetime: '2024-01-22T21:09:20.950000',
    subscaleSetting: {
      calculateTotalScore: null,
      subscales: [],
      totalScoresTableData: null,
    },
  },
  {
    decryptedAnswer: [
      {
        activityItem: {
          question: {
            en: 'Text',
          },
          responseType: 'text',
          config: {
            responseDataIdentifier: false,
            isIdentifier: null,
          },
          name: 'Item3',
          isHidden: false,
          allowEdit: true,
          id: '69a98366-8627-4c9b-9973-5c16416695b8',
        },
        answer: null,
      },
    ],
    answerId: 'ea2b4d38-0dbd-4344-9d12-42986f1dce4a',
    version: '1.1.2',
    startDatetime: '2024-01-22T22:09:12.424000',
    endDatetime: '2024-01-22T22:09:20.950000',
    subscaleSetting: {
      calculateTotalScore: null,
      subscales: [],
      totalScoresTableData: null,
    },
  },
];

const formattedResponses = {
  subscalesFrequency: 1,
  formattedResponses: {
    'b3825743-f796-4551-9057-662797ccd8c3': [
      {
        activityItem: {
          id: 'b3825743-f796-4551-9057-662797ccd8c3',
          name: 'Item1',
          question: { en: 'SS (updated)' },
          responseType: 'singleSelect',
          responseValues: {
            options: [
              { id: 'ba194132-91a7-49ee-a8ce-be97c7261ff0', text: 'SS 2 (updated)', value: 0 },
              { id: 'ac6bcb6b-d645-49f2-ba24-a8a60c82f303', text: 'SS 1', value: 1 },
            ],
          },
        },
        answers: [
          { answer: { value: 1, text: null }, date: '2024-01-22T20:07:22.782000' },
          { answer: { value: 0, text: null }, date: '2024-01-22T20:08:18.645000' },
        ],
      },
    ],
    'dfeb5edb-d797-4b5f-be40-05fea8de4c22': [
      {
        activityItem: {
          id: 'dfeb5edb-d797-4b5f-be40-05fea8de4c22',
          name: 'Item2',
          question: { en: 'MS' },
          responseType: 'multiSelect',
          responseValues: {
            options: [
              { id: '727f9f6d-ff0d-47f0-94e3-bc16d72024ff', text: 'MS 2', value: 0 },
              { id: '76286f9c-1ffe-43f2-8155-362bcf66dd13', text: 'MS 1', value: 1 },
            ],
          },
        },
        answers: [{ answer: { value: 1, text: null }, date: '2024-01-22T20:07:22.782000' }],
      },
      {
        activityItem: {
          id: 'dfeb5edb-d797-4b5f-be40-05fea8de4c22',
          name: 'Item2',
          question: { en: 'MS --> SS' },
          responseType: 'singleSelect',
          responseValues: {
            options: [
              { id: 'a14634c9-d39c-4f05-9197-43b9330bfd06', text: '2', value: 0 },
              { id: '196e2bfa-5216-4cbd-b4b0-97917db4243d', text: '1', value: 1 },
            ],
          },
        },
        answers: [{ answer: { value: 0, text: null }, date: '2024-01-22T20:08:18.645000' }],
      },
    ],
    '69a98366-8627-4c9b-9973-5c16416695b8': [
      {
        activityItem: {
          id: '69a98366-8627-4c9b-9973-5c16416695b8',
          name: 'Item3',
          question: { en: 'Text' },
          responseType: 'text',
          responseDataIdentifier: false,
          responseValues: undefined,
        },
        answers: [
          { answer: { value: 'Text 1', text: null }, date: '2024-01-22T20:07:22.782000' },
          { answer: { value: 'Text 2', text: null }, date: '2024-01-22T20:08:18.645000' },
          { answer: { value: 'Text 3', text: null }, date: '2024-01-22T20:09:20.950000' },
          { answer: { value: undefined, text: null }, date: '2024-01-22T21:09:20.950000' },
          { answer: { value: null, text: null }, date: '2024-01-22T22:09:20.950000' },
        ],
      },
    ],
    '85a332c4-7e47-4d9b-aaf7-b7a01acb98c2': [
      {
        activityItem: {
          id: '85a332c4-7e47-4d9b-aaf7-b7a01acb98c2',
          name: 'Item4',
          question: { en: 'Time' },
          responseType: 'time',
          responseValues: null,
        },
        answers: [
          { answer: { text: null, value: 126900000 }, date: '2024-01-22T20:07:22.782000' },
          { answer: { text: null, value: 115500000 }, date: '2024-01-22T20:08:18.645000' },
          { answer: { text: null, value: null }, date: '2024-01-22T20:09:20.950000' },
        ],
      },
    ],
    '2613ae84-7282-46e3-98e1-344c6fcbfe53': [
      {
        activityItem: {
          id: '2613ae84-7282-46e3-98e1-344c6fcbfe53',
          name: 'Item5',
          question: { en: 'Slider' },
          responseType: 'slider',
          responseValues: {
            options: [
              { id: '2613ae84-7282-46e3-98e1-344c6fcbfe53-0', text: 0, value: 0 },
              { id: '2613ae84-7282-46e3-98e1-344c6fcbfe53-1', text: 1, value: 1 },
              { id: '2613ae84-7282-46e3-98e1-344c6fcbfe53-2', text: 2, value: 2 },
              { id: '2613ae84-7282-46e3-98e1-344c6fcbfe53-3', text: 3, value: 3 },
              { id: '2613ae84-7282-46e3-98e1-344c6fcbfe53-4', text: 4, value: 4 },
              { id: '2613ae84-7282-46e3-98e1-344c6fcbfe53-5', text: 5, value: 5 },
              { id: '2613ae84-7282-46e3-98e1-344c6fcbfe53-6', text: 6, value: 6 },
              { id: '2613ae84-7282-46e3-98e1-344c6fcbfe53-7', text: 7, value: 7 },
              { id: '2613ae84-7282-46e3-98e1-344c6fcbfe53-8', text: 8, value: 8 },
              { id: '2613ae84-7282-46e3-98e1-344c6fcbfe53-9', text: 9, value: 9 },
              { id: '2613ae84-7282-46e3-98e1-344c6fcbfe53-10', text: 10, value: 10 },
            ],
          },
        },
        answers: [
          { answer: { text: null, value: 2 }, date: '2024-01-22T20:07:22.782000' },
          { answer: { text: null, value: null }, date: '2024-01-22T20:08:18.645000' },
          { answer: { text: null, value: 4 }, date: '2024-01-22T20:09:20.950000' },
        ],
      },
    ],
  },
};

describe('getFormattedResponses', () => {
  test('activity and answers should be formatted to FormattedResponse type', () => {
    const result = getFormattedResponses(activityResponses);
    expect(result).toEqual(formattedResponses);
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

describe('getOptionsMapper', () => {
  const mockFormattedActivityItem = {
    responseValues: {
      options: [
        { value: 3, text: 'Option C' },
        { value: 1, text: 'Option A' },
        { value: 2, text: 'Option B' },
        { value: 4, text: 'Option D' },
      ],
    },
  };

  test('returns correct index for all options', () => {
    const result = getOptionsMapper(mockFormattedActivityItem);

    expect(result).toEqual({
      1: 3,
      2: 2,
      3: 1,
      4: 0,
    });
  });
});

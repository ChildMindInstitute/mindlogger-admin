// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { render, screen } from '@testing-library/react';

import { ItemResponseType } from 'shared/consts';

import {
  getUniqueIdentifierOptions,
  formatActivityItemAnswers,
  getOptionsMapper,
  getSliderOptions,
  getEmptyState,
  getDateISO,
  getIdentifiers,
  getFormattedResponses,
  isAnswerTypeCorrect,
  isValueDefined,
  setDefaultFormValues,
} from './RespondentDataSummary.utils';
import {
  DEFAULT_END_DATE,
  DEFAULT_END_TIME,
  DEFAULT_START_DATE,
  DEFAULT_START_TIME,
} from '../RespondentData.const';

describe('Respondent Data Summary utils', () => {
  describe('getEmptyState', () => {
    test('returns JSX for no selected activity', () => {
      const result = getEmptyState();

      render(<>{result}</>);

      expect(
        screen.getByText(/Select the Activity to review the response data./),
      ).toBeInTheDocument();
    });

    test('returns JSX for performance task', () => {
      const selectedActivity = {
        isPerformanceTask: true,
      };

      const result = getEmptyState(selectedActivity);

      render(<>{result}</>);

      expect(
        screen.getByText(/Data visualization for Performance Tasks not supported/),
      ).toBeInTheDocument();
    });

    test('returns JSX for activity with no data', () => {
      const selectedActivity = {
        hasAnswer: false,
      };

      const result = getEmptyState(selectedActivity);

      render(<>{result}</>);

      expect(screen.getByText(/No available Data for this Activity yet/)).toBeInTheDocument();
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

  describe('getFormattedResponses', () => {
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

    test('activity and answers should be formatted to FormattedResponse type', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = getFormattedResponses(activityResponses);

      expect(result).toEqual(formattedResponses);
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

  describe('getSliderOptions', () => {
    const expectedOptions1 = [
      { id: 'slider1-0', text: 0, value: 0 },
      { id: 'slider1-1', text: 1, value: 1 },
      { id: 'slider1-2', text: 2, value: 2 },
      { id: 'slider1-3', text: 3, value: 3 },
    ];
    const expectedOptions2 = [{ id: 'slider2-1', text: 1, value: 1 }];

    test.each`
      minValue | maxValue | itemId       | expectedOptions     | description
      ${0}     | ${3}     | ${'slider1'} | ${expectedOptions1} | ${'should create slider options [0, 3]'}
      ${1}     | ${1}     | ${'slider2'} | ${expectedOptions2} | ${'should create slider options for a single value'}
    `('$description', ({ minValue, maxValue, itemId, expectedOptions }) => {
      const result = getSliderOptions({ minValue, maxValue }, itemId);
      expect(result).toEqual(expectedOptions);
    });
  });

  describe('formatActivityItemAnswers', () => {
    const sharedProps = {
      date: '2024-03-14T10:03:01.345000',
    };

    const singleSelectionProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'Single selection question',
          },
          responseType: 'singleSelect',
          responseValues: {
            paletteName: null,
            options: [
              {
                id: '3157ca3a-6999-4638-991d-e89e8d0439f6',
                text: 'op1',
                image: null,
                score: 0,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 0,
              },
            ],
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            randomizeOptions: false,
            timer: 0,
            addScores: true,
            setAlerts: false,
            addTooltip: false,
            setPalette: false,
            addTokens: null,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: false,
            },
            autoAdvance: true,
          },
          name: 'single_extraText_and_NO_SCORES',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: 'ee6ad0fa-3a86-46db-b432-508f803022f6',
          order: 1,
        },
        answers: {
          value: 0,
        },
        items: [], // skip, no need for the test
      },
    };
    const singleSelectionResult = {
      activityItem: {
        id: 'ee6ad0fa-3a86-46db-b432-508f803022f6',
        name: 'single_extraText_and_NO_SCORES',
        question: {
          en: 'Single selection question',
        },
        responseType: 'singleSelect',
        responseValues: {
          options: [
            {
              id: '3157ca3a-6999-4638-991d-e89e8d0439f6',
              text: 'op1',
              value: 0,
            },
          ],
        },
      },
      answers: [
        {
          answer: {
            text: null,
            value: null,
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };

    const multipleSelectionProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'Multi selection question',
          },
          responseType: 'multiSelect',
          responseValues: {
            paletteName: null,
            options: [
              {
                id: '382eb08b-13b4-46dc-83fa-3cf63a026ea0',
                text: 'opt2',
                image: null,
                score: null,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 1,
                isNoneAbove: false,
              },
              {
                id: '2e1e0598-6ed5-4448-b1fd-88447988af30',
                text: 'opt1',
                image: null,
                score: null,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 0,
                isNoneAbove: false,
              },
            ],
          },
          config: {
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
              textInputOption: true,
              textInputRequired: false,
            },
          },
          name: 'multi_extraText_and_NO_SCORES',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: 'dc621e85-3bd6-41b7-abb2-12f2c1fca248',
          order: 2,
        },
        answers: {
          value: [1],
        },
        items: [], // skip, no need for the test
      },
    };
    const multipleSelectionResult = {
      activityItem: {
        id: 'dc621e85-3bd6-41b7-abb2-12f2c1fca248',
        name: 'multi_extraText_and_NO_SCORES',
        question: {
          en: 'Multi selection question',
        },
        responseType: 'multiSelect',
        responseValues: {
          options: [
            {
              id: '382eb08b-13b4-46dc-83fa-3cf63a026ea0',
              text: 'opt2',
              value: 0,
            },
            {
              id: '2e1e0598-6ed5-4448-b1fd-88447988af30',
              text: 'opt1',
              value: 1,
            },
          ],
        },
      },
      answers: [
        {
          answer: {
            text: null,
            value: null,
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };

    const sliderProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'Slider question',
          },
          responseType: 'slider',
          responseValues: {
            minLabel: 'min',
            maxLabel: 'max',
            minValue: 5,
            maxValue: 10,
            minImage: null,
            maxImage: null,
            scores: null,
            alerts: null,
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            addScores: false,
            setAlerts: false,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: false,
            },
            showTickMarks: false,
            showTickLabels: false,
            continuousSlider: false,
            timer: 0,
          },
          name: 'slider_extraText_and_NO_SCORES',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '298b1436-3963-41c1-852b-82ebb2ab5468',
          order: 3,
        },
        answers: {
          value: 8,
        },
        items: [], // skip, no need for the test
      },
    };
    const sliderResult = {
      activityItem: {
        id: '298b1436-3963-41c1-852b-82ebb2ab5468',
        name: 'slider_extraText_and_NO_SCORES',
        question: {
          en: 'Slider question',
        },
        responseType: 'slider',
        responseValues: {
          options: [
            {
              id: '298b1436-3963-41c1-852b-82ebb2ab5468-5',
              text: 5,
              value: 5,
            },
            {
              id: '298b1436-3963-41c1-852b-82ebb2ab5468-6',
              text: 6,
              value: 6,
            },
            {
              id: '298b1436-3963-41c1-852b-82ebb2ab5468-7',
              text: 7,
              value: 7,
            },
            {
              id: '298b1436-3963-41c1-852b-82ebb2ab5468-8',
              text: 8,
              value: 8,
            },
            {
              id: '298b1436-3963-41c1-852b-82ebb2ab5468-9',
              text: 9,
              value: 9,
            },
            {
              id: '298b1436-3963-41c1-852b-82ebb2ab5468-10',
              text: 10,
              value: 10,
            },
          ],
        },
      },
      answers: [
        {
          answer: {
            text: null,
            value: null,
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };

    const textProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'text question',
          },
          responseType: 'text',
          responseValues: null,
          config: {
            removeBackButton: false,
            skippableItem: false,
            maxResponseLength: 300,
            correctAnswerRequired: false,
            correctAnswer: '',
            numericalResponseRequired: false,
            responseDataIdentifier: false,
            responseRequired: true,
            isIdentifier: null,
          },
          name: 'text_with_response',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: 'bd670ac1-75a5-4c46-8b70-be664b9e19a5',
          order: 10,
        },
        answers: 'Test',
        items: [], // skip, no need for the test
      },
    };
    const textResult = {
      activityItem: {
        id: 'bd670ac1-75a5-4c46-8b70-be664b9e19a5',
        name: 'text_with_response',
        question: {
          en: 'text question',
        },
        responseDataIdentifier: false,
        responseType: 'text',
        responseValues: null,
      },
      answers: [
        {
          answer: {
            text: null,
            value: undefined,
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };

    const timeProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'Time question',
          },
          responseType: 'time',
          responseValues: null,
          config: {
            removeBackButton: false,
            skippableItem: false,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: false,
            },
            timer: 0,
          },
          name: 'time_extraText',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '6c50d1fa-05f1-4f18-af43-1e568ab9bb0e',
          order: 5,
        },
        answers: {
          value: {
            minutes: 59,
            hours: 12,
          },
        },
        items: [], // skip, no need for the test
      },
    };
    const timeResult = {
      activityItem: {
        id: '6c50d1fa-05f1-4f18-af43-1e568ab9bb0e',
        name: 'time_extraText',
        question: {
          en: 'Time question',
        },
        responseType: 'time',
        responseValues: null,
      },
      answers: [
        {
          answer: {
            text: null,
            value: null,
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };

    const numberSelectionProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'Number selection question',
          },
          responseType: 'numberSelect',
          responseValues: {
            minValue: 0,
            maxValue: 100,
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: false,
            },
          },
          name: 'number_selection_extraText',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '4bcb492b-3709-4633-935b-3b45978d0835',
          order: 4,
        },
        answer: {
          value: '40',
        },
        items: [], // skip, no need for the test
      },
    };
    const numberSelectionResult = {
      activityItem: {
        id: '4bcb492b-3709-4633-935b-3b45978d0835',
        name: 'number_selection_extraText',
        question: {
          en: 'Number selection question',
        },
        responseType: 'numberSelect',
        responseValues: {
          maxValue: 100,
          minValue: 0,
        },
      },
      answers: [
        {
          answer: {
            text: null,
            value: '40',
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };

    const dateProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'date_item_skippable',
          },
          responseType: 'date',
          responseValues: null,
          config: {
            removeBackButton: false,
            skippableItem: true,
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
            timer: 0,
          },
          name: 'date_item_skippable',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '05a5dac0-02c7-4443-99ed-2b0be9ec3807',
          order: 5,
        },
        answer: {
          value: {
            day: 17,
            month: 3,
            year: 2024,
          },
        },
        items: [], // skip, no need for the test
      },
    };
    const dateResult = {
      activityItem: {
        id: '05a5dac0-02c7-4443-99ed-2b0be9ec3807',
        name: 'date_item_skippable',
        question: {
          en: 'date_item_skippable',
        },
        responseType: 'date',
        responseValues: null,
      },
      answers: [
        {
          answer: {
            value: '17 Mar 2024',
            text: null,
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };

    const drawingProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'drawing_extraText question',
          },
          responseType: 'drawing',
          responseValues: {
            drawingBackground: 'https://path_to_drawingBackground',
            drawingExample: 'https://path_to_drawingExample',
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: false,
            },
            timer: 0,
            removeUndoButton: false,
            navigationToTop: false,
          },
          name: 'drawing_extraText',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: 'a2ff06a5-24f4-4bf9-a88a-7f9ec17e3c37',
          order: 11,
        },
        answer: {
          text: 'Test',
          value: {
            svgString: 'svg_string',
            width: 362.7272644042969,
            fileName: '9b977cde-d5ea-4728-a638-da2c091fc033.svg',
            type: 'image/svg',
            uri: 's3://some_path_to_svg',
            lines: [], // skip, no need for the test
          },
        },
        items: [], // skip, no need for the test
      },
    };
    const drawingResult = {
      activityItem: {
        id: 'a2ff06a5-24f4-4bf9-a88a-7f9ec17e3c37',
        name: 'drawing_extraText',
        question: {
          en: 'drawing_extraText question',
        },
        responseType: 'drawing',
        responseValues: {
          drawingBackground: 'https://path_to_drawingBackground',
          drawingExample: 'https://path_to_drawingExample',
        },
      },
      answers: [
        {
          answer: {
            text: null,
            value: null,
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };
    const timeRangeProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'Time range question',
          },
          responseType: 'timeRange',
          responseValues: null,
          config: {
            removeBackButton: false,
            skippableItem: true,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: false,
            },
            timer: 0,
          },
          name: 'time_range_extraText',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: 'b0d3bd40-745c-4b3e-bfa2-9f27a2f38e7d',
          order: 7,
        },
        answer: {
          value: {
            from: {
              hour: 6,
              minute: 0,
            },
            to: {
              hour: 22,
              minute: 30,
            },
          },
        },
        items: [], // skip, no need for the test
      },
    };
    const timeRangeResult = {
      activityItem: {
        id: 'b0d3bd40-745c-4b3e-bfa2-9f27a2f38e7d',
        name: 'time_range_extraText',
        question: {
          en: 'Time range question',
        },
        responseType: 'timeRange',
        responseValues: null,
      },
      answers: [
        {
          answer: {
            text: null,
            value: {
              from: '06:00',
              to: '22:30',
            },
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };

    test.each`
      props                     | result                     | description
      ${singleSelectionProps}   | ${singleSelectionResult}   | ${'single selection'}
      ${multipleSelectionProps} | ${multipleSelectionResult} | ${'multi selection'}
      ${sliderProps}            | ${sliderResult}            | ${'slider'}
      ${textProps}              | ${textResult}              | ${'text'}
      ${timeProps}              | ${timeResult}              | ${'time'}
      ${numberSelectionProps}   | ${numberSelectionResult}   | ${'number selection'}
      ${dateProps}              | ${dateResult}              | ${'date'}
      ${timeRangeProps}         | ${timeRangeResult}         | ${'time range'}
      ${drawingProps}           | ${drawingResult}           | ${'drawing item'}
    `('$description', ({ props, result }) => {
      expect(formatActivityItemAnswers(props.currentAnswer, props.date)).toStrictEqual(result);
    });
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = getOptionsMapper(mockFormattedActivityItem);

      expect(result).toEqual({
        1: 3,
        2: 2,
        3: 1,
        4: 0,
      });
    });
  });

  describe('setDefaultFormValues', () => {
    test('should set default values for form fields', () => {
      const setValueMock = jest.fn();
      setDefaultFormValues(setValueMock);

      expect(setValueMock).toHaveBeenCalledTimes(6);
      expect(setValueMock).toHaveBeenCalledWith('startDate', DEFAULT_START_DATE);
      expect(setValueMock).toHaveBeenCalledWith('endDate', DEFAULT_END_DATE);
      expect(setValueMock).toHaveBeenCalledWith('startTime', DEFAULT_START_TIME);
      expect(setValueMock).toHaveBeenCalledWith('endTime', DEFAULT_END_TIME);
      expect(setValueMock).toHaveBeenCalledWith('filterByIdentifier', false);
      expect(setValueMock).toHaveBeenCalledWith('identifier', []);
    });
  });
});

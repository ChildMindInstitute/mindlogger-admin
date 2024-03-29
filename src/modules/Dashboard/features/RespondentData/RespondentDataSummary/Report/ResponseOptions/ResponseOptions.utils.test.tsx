import { getResponseItem } from './ResponseOptions.utils';

jest.mock('chartjs-adapter-date-fns', () => ({}));

describe('ResponseOptions.utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`getResponseItem`, () => {
    const sharedProps = {
      color: '#0b6e99',
      minDate: '2024-03-12T21:00:20.190Z',
      maxDate: '2024-03-19T20:59:20.190Z',
      versions: [
        {
          version: '1.0.4',
          createdAt: '2024-03-14T09:59:07.486824',
        },
      ],
    };
    const sharedSelectionRowResponseValues = {
      rows: [
        {
          id: '315e0b97-ca13-4aa2-a1b0-45758c696bee',
          rowName: 'Row 1',
        },
        {
          id: 'fd5e90ec-0adf-4785-b82b-76adbc117a69',
          rowName: 'Row 2',
        },
        {
          id: '4841e580-e850-48e8-b147-8914dc8b2add',
          rowName: 'Row 3',
        },
      ],
      options: [
        {
          id: '49ed757b-56dc-409d-b0db-e4485fa2eca8',
          text: 'Option 1',
          image: null,
          tooltip: null,
        },
        {
          id: '06c2a948-2f49-46b9-91e6-5f530137c375',
          text: 'Option 2',
          image: null,
          tooltip: null,
        },
        {
          id: '57d4f628-7a84-46b5-8264-18aa5a5527fe',
          text: 'Option 3',
          image: null,
          tooltip: null,
        },
      ],
    };
    const singleSelectionItemProps = {
      ...sharedProps,
      activityItemAnswer: {
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
              value: 0,
              text: null,
            },
            date: '2024-03-14T10:03:01.345000',
          },
        ],
        dataTestid: 'response-option-0-0',
      },
    };
    const multiSlectionItemProps = {
      ...sharedProps,
      activityItemAnswer: {
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
              value: 1,
              text: null,
            },
            date: '2024-03-14T16:53:24.055000',
          },
        ],
        dataTestid: 'response-option-1-0',
      },
    };
    const sliderItemProps = {
      ...sharedProps,
      activityItemAnswer: {
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
              value: 6,
              text: null,
            },
            date: '2024-03-14T16:53:24.055000',
          },
          {
            answer: {
              value: null,
              text: null,
            },
            date: '2024-03-15T13:35:27.961000',
          },
        ],
        dataTestid: 'response-option-2-0',
      },
    };
    const numberSelectionItemProps = {
      ...sharedProps,
      activityItemAnswer: {
        activityItem: {
          id: '4bcb492b-3709-4633-935b-3b45978d0835',
          name: 'number_selection_extraText',
          question: {
            en: 'Number selection question',
          },
          responseType: 'numberSelect',
          responseValues: {
            minValue: 6,
            maxValue: 12,
          },
        },
        answers: [
          {
            answer: {
              value: null,
              text: null,
            },
            date: '2024-03-15T13:35:27.961000',
          },
          {
            answer: {
              value: '10',
              text: null,
            },
            date: '2024-03-15T18:12:57.700000',
          },
        ],
        dataTestid: 'response-option-3-0',
      },
    };
    const timeItemProps = {
      ...sharedProps,
      activityItemAnswer: {
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
              value: 139500000,
              text: null,
            },
            date: '2024-03-14T16:53:24.055000',
          },
          {
            answer: {
              value: null,
              text: null,
            },
            date: '2024-03-15T13:35:27.961000',
          },
        ],
        dataTestid: 'response-option-4-0',
      },
    };
    const textItemProps = {
      ...sharedProps,
      activityItemAnswer: {
        activityItem: {
          id: 'bd670ac1-75a5-4c46-8b70-be664b9e19a5',
          question: {
            name: 'text_with_response',
            en: 'text question',
          },
          responseType: 'text',
          responseValues: null,
          responseDataIdentifier: false,
        },
        answers: [
          {
            answer: {
              value: 'Test',
              text: null,
            },
            date: '2024-03-14T10:03:01.345000',
          },
          {
            answer: {
              value: null,
              text: null,
            },
            date: '2024-03-15T18:12:57.700000',
          },
        ],
        dataTestid: 'response-option-9-0',
      },
    };
    const dateItemProps = {
      ...sharedProps,
      activityItemAnswer: {
        activityItem: {
          id: '05a5dac0-02c7-4443-99ed-2b0be9ec3807',
          name: 'date_item_skippable',
          question: {
            en: 'date_item_skippable',
          },
          responseType: 'date',
          responseValues: null,
        },
        dataTestid: 'response-option-3-0',
        answers: [
          {
            answer: {
              value: null,
              text: null,
            },
            date: '2024-03-15T13:35:27.961000',
          },
          {
            answer: {
              value: '17 Mar 2024',
              text: null,
            },
            date: '2024-03-15T18:12:57.700000',
          },
        ],
      },
    };
    const timeRangeItemProps = {
      ...sharedProps,
      activityItemAnswer: {
        activityItem: {
          id: 'b0d3bd40-745c-4b3e-bfa2-9f27a2f38e7d',
          name: 'time_range_extraText',
          question: {
            en: 'Time range question',
          },
          responseType: 'timeRange',
          responseValues: null,
        },
        dataTestid: 'response-option-5-0',
        answers: [
          {
            answer: {
              value: null,
              text: null,
            },
            date: '2024-03-15T13:35:27.961000',
          },
          {
            answer: {
              value: {
                from: '06:00',
                to: '22:30',
              },
              text: null,
            },
            date: '2024-03-15T18:12:57.700000',
          },
        ],
      },
    };
    const singleSelectRowsItemProps = {
      ...sharedProps,
      activityItemAnswer: {
        activityItem: {
          id: '187c7d7e-49e6-4d2b-b70d-551a5a1fef61',
          name: 'single_select_rows_item',
          question: {
            en: 'Single Selection per Rows',
          },
          responseType: 'singleSelectRows',
          responseValues: sharedSelectionRowResponseValues,
        },
        dataTestid: 'single-select-rows',
        answers: {
          'Row 1': [
            {
              answer: {
                value: 'Option 3',
                text: null,
              },
              date: '2024-03-27T15:44:46.674000',
            },
          ],
          'Row 2': [
            {
              answer: {
                value: 'Option 1',
                text: null,
              },
              date: '2024-03-27T15:44:46.674000',
            },
            {
              answer: {
                value: 'Option 2',
                text: null,
              },
              date: '2024-03-27T15:44:46.674000',
            },
          ],
          'Row 3': [
            {
              answer: {
                value: 'Option 2',
                text: null,
              },
              date: '2024-03-27T16:06:12.610000',
            },
          ],
        },
      },
    };
    const multiSelectRowsItemProps = {
      ...sharedProps,
      activityItemAnswer: {
        activityItem: {
          id: '187c7d7e-49e6-4d2b-b70d-551a5a1fef61',
          name: 'multi_select_rows_item',
          question: {
            en: 'Multi Selection per Rows',
          },
          responseType: 'multiSelectRows',
          responseValues: sharedSelectionRowResponseValues,
        },
        dataTestid: 'multi-select-rows',
        answers: {
          'Row 1': [
            {
              answer: {
                value: 'Option 1',
                text: null,
              },
              date: '2024-03-27T15:44:46.674000',
            },
          ],
          'Row 2': [
            {
              answer: {
                value: 'Option 1',
                text: null,
              },
              date: '2024-03-27T15:44:46.674000',
            },
            {
              answer: {
                value: 'Option 3',
                text: null,
              },
              date: '2024-03-27T15:44:46.674000',
            },
          ],
          'Row 3': [
            {
              answer: {
                value: 'Option 2',
                text: null,
              },
              date: '2024-03-27T16:06:12.610000',
            },
          ],
        },
      },
    };
    const singleSelectionItemResult = {
      ...sharedProps,
      answers: [{ answer: { text: null, value: 0 }, date: '2024-03-14T10:03:01.345000' }],
      'data-testid': 'response-option-0-0-multi-scatter-chart',
      height: 72,
      maxY: 0,
      minY: 0,
      options: [{ id: '3157ca3a-6999-4638-991d-e89e8d0439f6', text: 'op1', value: 0 }],
      responseType: 'singleSelect',
    };

    const multiSelectionItemResult = {
      ...sharedProps,
      answers: [{ answer: { text: null, value: 1 }, date: '2024-03-14T16:53:24.055000' }],
      'data-testid': 'response-option-1-0-multi-scatter-chart',
      height: 108,
      maxY: 1,
      minY: 0,
      options: [
        { id: '382eb08b-13b4-46dc-83fa-3cf63a026ea0', text: 'opt2', value: 0 },
        { id: '2e1e0598-6ed5-4448-b1fd-88447988af30', text: 'opt1', value: 1 },
      ],
      responseType: 'multiSelect',
    };
    const sliderItemResult = {
      ...sharedProps,
      answers: [
        { answer: { text: null, value: 6 }, date: '2024-03-14T16:53:24.055000' },
        { answer: { text: null, value: null }, date: '2024-03-15T13:35:27.961000' },
      ],
      'data-testid': 'response-option-2-0-multi-scatter-chart',
      height: 252,
      maxY: 10,
      minY: 5,
      options: [
        { id: '298b1436-3963-41c1-852b-82ebb2ab5468-5', text: 5, value: 5 },
        { id: '298b1436-3963-41c1-852b-82ebb2ab5468-6', text: 6, value: 6 },
        { id: '298b1436-3963-41c1-852b-82ebb2ab5468-7', text: 7, value: 7 },
        { id: '298b1436-3963-41c1-852b-82ebb2ab5468-8', text: 8, value: 8 },
        { id: '298b1436-3963-41c1-852b-82ebb2ab5468-9', text: 9, value: 9 },
        { id: '298b1436-3963-41c1-852b-82ebb2ab5468-10', text: 10, value: 10 },
      ],
      responseType: 'slider',
    };
    const numberSelectionItemResult = {
      ...sharedProps,
      answers: [
        { answer: { text: null, value: null }, date: '2024-03-15T13:35:27.961000' },
        { answer: { text: null, value: '10' }, date: '2024-03-15T18:12:57.700000' },
      ],
      'data-testid': 'response-option-3-0-multi-scatter-chart',
      height: 288,
      maxY: 12,
      minY: 6,
      options: [
        { id: '6', text: 6, value: 6 },
        { id: '7', text: 7, value: 7 },
        { id: '8', text: 8, value: 8 },
        { id: '9', text: 9, value: 9 },
        { id: '10', text: 10, value: 10 },
        { id: '11', text: 11, value: 11 },
        { id: '12', text: 12, value: 12 },
      ],
      responseType: 'numberSelect',
    };
    const textItemResult = {
      answers: [
        { answer: { text: null, value: 'Test' }, date: '2024-03-14T10:03:01.345000' },
        { answer: { text: null, value: null }, date: '2024-03-15T18:12:57.700000' },
      ],
      'data-testid': 'response-option-9-0',
      responseType: 'text',
    };
    const timeItemResult = {
      ...sharedProps,
      answers: [
        { answer: { text: null, value: 139500000 }, date: '2024-03-14T16:53:24.055000' },
        { answer: { text: null, value: null }, date: '2024-03-15T13:35:27.961000' },
      ],
      'data-testid': 'response-option-4-0-time-picker-chart',
    };
    const dateItemResult = {
      answers: [
        { answer: { text: null, value: null }, date: '2024-03-15T13:35:27.961000' },
        { answer: { text: null, value: '17 Mar 2024' }, date: '2024-03-15T18:12:57.700000' },
      ],
      'data-testid': 'response-option-3-0',
      responseType: 'date',
    };
    const timeRangeItemResult = {
      answers: [
        { answer: { text: null, value: null }, date: '2024-03-15T13:35:27.961000' },
        {
          answer: { text: null, value: { from: '06:00', to: '22:30' } },
          date: '2024-03-15T18:12:57.700000',
        },
      ],
      'data-testid': 'response-option-5-0',
      responseType: 'timeRange',
    };

    const {
      activityItemAnswer: {
        activityItem: singleSelectRowsActivityItem,
        answers: singleSelectRowsAnswers,
      },
    } = singleSelectRowsItemProps;
    const singleSelectRowsItemResult = {
      ...sharedProps,
      activityItem: singleSelectRowsActivityItem,
      answers: singleSelectRowsAnswers,
      'data-testid': 'single-select-rows',
    };

    const {
      activityItemAnswer: {
        activityItem: multiSelectRowsActivityItem,
        answers: multiSelectRowsAnswers,
      },
    } = multiSelectRowsItemProps;
    const multiSelectRowsItemResult = {
      ...sharedProps,
      activityItem: multiSelectRowsActivityItem,
      answers: multiSelectRowsAnswers,
      'data-testid': 'multi-select-rows',
    };

    test.each`
      itemProps                    | result                        | description
      ${singleSelectionItemProps}  | ${singleSelectionItemResult}  | ${'single selection'}
      ${multiSlectionItemProps}    | ${multiSelectionItemResult}   | ${'multi selection'}
      ${sliderItemProps}           | ${sliderItemResult}           | ${'slider'}
      ${numberSelectionItemProps}  | ${numberSelectionItemResult}  | ${'number selection'}
      ${textItemProps}             | ${textItemResult}             | ${'text '}
      ${dateItemProps}             | ${dateItemResult}             | ${'date '}
      ${timeItemProps}             | ${timeItemResult}             | ${'time'}
      ${timeRangeItemProps}        | ${timeRangeItemResult}        | ${'time range'}
      ${singleSelectRowsItemProps} | ${singleSelectRowsItemResult} | ${'single selection per row'}
      ${multiSelectRowsItemProps}  | ${multiSelectRowsItemResult}  | ${'multi selection per row'}
    `('$description', ({ itemProps, result }) => {
      const itemComponent = getResponseItem(itemProps);
      expect(itemComponent?.props).toEqual(result);
    });
  });
});

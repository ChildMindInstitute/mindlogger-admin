import { ItemResponseType } from 'shared/consts';

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
    const singleSelectionItemProps = {
      ...sharedProps,
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
    };
    const multiSlectionItemProps = {
      ...sharedProps,
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
    };
    const sliderItemProps = {
      ...sharedProps,
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
    };
    const numberSelectionItemProps = {
      ...sharedProps,
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
    };
    const timeItemProps = {
      ...sharedProps,
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
    };
    const textItemProps = {
      ...sharedProps,
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
    };
    const dateItemProps = {
      ...sharedProps,
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
    };
    const timeRangeItemProps = {
      ...sharedProps,
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
    };

    const singleSelectionItemResult = {
      ...singleSelectionItemProps,
      activityItem: undefined,
      dataTestid: undefined,
      height: 72,
      maxY: 0,
      minY: 0,
      'data-testid': 'response-option-0-0-multi-scatter-chart',
      options: [
        {
          id: '3157ca3a-6999-4638-991d-e89e8d0439f6',
          text: 'op1',
          value: 0,
        },
      ],
      responseType: 'singleSelect',
    };
    const multiSelectionItemResult = {
      ...multiSlectionItemProps,
      activityItem: undefined,
      dataTestid: undefined,
      height: 108,
      maxY: 1,
      minY: 0,
      'data-testid': 'response-option-1-0-multi-scatter-chart',
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
      responseType: 'multiSelect',
    };
    const sliderItemResult = {
      ...sliderItemProps,
      activityItem: undefined,
      dataTestid: undefined,
      height: 252,
      maxY: 10,
      minY: 5,
      'data-testid': 'response-option-2-0-multi-scatter-chart',
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
      responseType: 'slider',
    };
    const numberSelectionItemResult = {
      ...numberSelectionItemProps,
      activityItem: undefined,
      dataTestid: undefined,
      height: 288,
      maxY: 12,
      minY: 6,
      'data-testid': 'response-option-3-0-multi-scatter-chart',
      options: [
        {
          id: '6',
          text: 6,
          value: 6,
        },
        {
          id: '7',
          text: 7,
          value: 7,
        },
        {
          id: '8',
          text: 8,
          value: 8,
        },
        {
          id: '9',
          text: 9,
          value: 9,
        },
        {
          id: '10',
          text: 10,
          value: 10,
        },
        {
          id: '11',
          text: 11,
          value: 11,
        },
        {
          id: '12',
          text: 12,
          value: 12,
        },
      ],
      responseType: 'numberSelect',
    };
    const textItemResult = {
      responseType: ItemResponseType.Text,
      answers: textItemProps.answers,
      'data-testid': 'response-option-9-0',
    };
    const timeItemResult = {
      ...timeItemProps,
      activityItem: undefined,
      dataTestid: undefined,
      'data-testid': 'response-option-4-0-time-picker-chart',
    };
    const dateItemResult = {
      responseType: ItemResponseType.Date,
      answers: dateItemProps.answers,
      'data-testid': 'response-option-3-0',
    };
    const timeRangeItemResult = {
      responseType: ItemResponseType.TimeRange,
      answers: timeRangeItemProps.answers,
      'data-testid': 'response-option-5-0',
    };

    test.each`
      itemProps                   | result                       | description
      ${singleSelectionItemProps} | ${singleSelectionItemResult} | ${'single selection'}
      ${multiSlectionItemProps}   | ${multiSelectionItemResult}  | ${'multi selection'}
      ${sliderItemProps}          | ${sliderItemResult}          | ${'slider'}
      ${numberSelectionItemProps} | ${numberSelectionItemResult} | ${'number selection'}
      ${textItemProps}            | ${textItemResult}            | ${'text '}
      ${dateItemProps}            | ${dateItemResult}            | ${'date '}
      ${timeItemProps}            | ${timeItemResult}            | ${'time'}
      ${timeRangeItemProps}       | ${timeRangeItemResult}       | ${'time range'}
    `('$description', ({ itemProps, result }) => {
      const itemComponent = getResponseItem(itemProps);
      expect(itemComponent?.props).toEqual(result);
    });
  });
});

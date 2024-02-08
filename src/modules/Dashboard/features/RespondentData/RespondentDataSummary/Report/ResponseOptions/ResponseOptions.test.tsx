// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, within } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { ResponseOptions } from './ResponseOptions';

const mockedResponseOptions = {
  '7b409ea6-bbc6-4d74-aada-7114bc120264': [
    {
      activityItem: {
        id: '7b409ea6-bbc6-4d74-aada-7114bc120264',
        name: 'Item1',
        question: {
          en: 'Single Select Item',
        },
        responseType: 'singleSelect',
        responseValues: {
          options: [
            {
              id: '67c42622-ba0a-4e97-aef0-de44c80c9f91',
              text: 'Option 3',
              value: 0,
            },
            {
              id: '9c5d805f-9302-4633-b749-02cecfdd464e',
              text: 'Option 2',
              value: 1,
            },
            {
              id: '6e4ed66d-ff12-4965-8bc2-dd79fefc82a9',
              text: 'Option 1',
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
          date: '2024-01-09T14:00:02.847000',
        },
      ],
    },
  ],
  '395b4527-34f8-42df-b8ff-669f495fbba7': [
    {
      activityItem: {
        id: '395b4527-34f8-42df-b8ff-669f495fbba7',
        name: 'Item2',
        question: {
          en: 'Slider Item',
        },
        responseType: 'slider',
        responseValues: {
          options: [
            {
              id: '395b4527-34f8-42df-b8ff-669f495fbba7-0',
              text: 0,
              value: 0,
            },
            {
              id: '395b4527-34f8-42df-b8ff-669f495fbba7-1',
              text: 1,
              value: 1,
            },
            {
              id: '395b4527-34f8-42df-b8ff-669f495fbba7-2',
              text: 2,
              value: 2,
            },
            {
              id: '395b4527-34f8-42df-b8ff-669f495fbba7-3',
              text: 3,
              value: 3,
            },
            {
              id: '395b4527-34f8-42df-b8ff-669f495fbba7-4',
              text: 4,
              value: 4,
            },
            {
              id: '395b4527-34f8-42df-b8ff-669f495fbba7-5',
              text: 5,
              value: 5,
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
          date: '2024-01-09T14:00:02.847000',
        },
      ],
    },
  ],
  '146409e3-4319-4628-96c0-198e771f15de': [
    {
      activityItem: {
        id: '146409e3-4319-4628-96c0-198e771f15de',
        name: 'Item3',
        question: {
          en: 'Text Item',
        },
        responseType: 'text',
        responseValues: null,
        responseDataIdentifier: false,
      },
      answers: [
        {
          answer: {
            value: 'Jane Doe',
            text: null,
          },
          date: '2024-01-09T14:00:02.847000',
        },
      ],
    },
  ],
  '34a1e92c-2e78-4cd1-a527-00e4f8426d20': [
    {
      activityItem: {
        id: '34a1e92c-2e78-4cd1-a527-00e4f8426d20',
        name: 'Item4',
        question: {
          en: 'Multi Select Item',
        },
        responseType: 'multiSelect',
        responseValues: {
          options: [
            {
              id: '84c3a6f0-56c5-4e2c-b9fc-3d4bcbdddbac',
              text: 'Option 3',
              value: 0,
            },
            {
              id: '097a18b3-91fc-4a4e-8102-d651bb982b18',
              text: 'Option 2',
              value: 1,
            },
            {
              id: '24398ef2-6582-4dcf-804c-57fc414fd90f',
              text: 'Option 1',
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
          date: '2024-01-09T14:00:02.847000',
        },
        {
          answer: {
            value: 2,
            text: null,
          },
          date: '2024-01-09T14:00:02.847000',
        },
      ],
    },
  ],
  'a1ce8c6f-8136-4ca8-8bab-89da58e30ce5': [
    {
      activityItem: {
        id: 'a1ce8c6f-8136-4ca8-8bab-89da58e30ce5',
        name: 'Item5',
        question: {
          en: 'Time Picker Item',
        },
        responseType: 'time',
        responseValues: null,
      },
      answers: [
        {
          answer: {
            value: 138600000,
            text: null,
          },
          date: '2024-01-09T14:00:02.847000',
        },
      ],
    },
  ],
  '7ff0f546-348b-43ef-8702-8beb0b57e5e8': [
    {
      activityItem: {
        id: '7ff0f546-348b-43ef-8702-8beb0b57e5e8',
        name: 'Item6',
        question: {
          en: 'Time Range Item',
        },
        responseType: 'timeRange',
        responseValues: null,
      },
      answers: [
        {
          answer: {
            value: null,
            text: null,
          },
          date: '2024-01-09T14:00:02.847000',
        },
      ],
    },
  ],
};

const questionRegExp = /response-option-\d+-\d+-question$/;
const textTableRegExp = /response-option-\d+-\d+-table$/;
const multiScatterChart = 'multi-scatter-chart';
const timePickerLineChart = 'time-picker-line-chart';

const mockedWatch = jest.fn();

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    watch: () => mockedWatch(),
    setValue: () => jest.fn(),
  }),
}));

jest.mock('../Charts/LineChart/TimePickerLineChart', () => ({
  __esModule: true,
  TimePickerLineChart: () => <div data-testid={timePickerLineChart} />,
}));

jest.mock('../Charts/MultiScatterChart', () => ({
  __esModule: true,
  MultiScatterChart: () => <div data-testid={multiScatterChart} />,
}));

jest.mock('modules/Dashboard/features/RespondentData/CollapsedMdText', () => ({
  __esModule: true,
  ...jest.requireActual('modules/Dashboard/features/RespondentData/CollapsedMdText'),
  CollapsedMdText: ({ text, 'data-testid': dataTestid }) => <div data-testid={dataTestid}>{text}</div>,
}));

describe('ResponseOptions', () => {
  beforeEach(() => {
    mockedWatch.mockReturnValue({});
  });

  test('renders component and children correctly', async () => {
    renderWithProviders(<ResponseOptions responseOptions={mockedResponseOptions} versions={[]} />);

    const responseOptions = screen.queryAllByTestId(/response-option-\d+-\d+$/);
    expect(responseOptions).toHaveLength(6);

    const [singleSelect, slider, text, multiSelect, timePicker, timeRange] = responseOptions;

    // single select
    const singleSelectQuestion = within(singleSelect).getByTestId(questionRegExp);
    expect(singleSelectQuestion).toHaveTextContent('Single Select Item');

    const singleSelectChart = within(singleSelect).getByTestId(multiScatterChart);
    expect(singleSelectChart).toBeInTheDocument();

    // slider
    const sliderQuestion = within(slider).getByTestId(questionRegExp);
    expect(sliderQuestion).toHaveTextContent('Slider Item');

    const sliderChart = within(slider).getByTestId(multiScatterChart);
    expect(sliderChart).toBeInTheDocument();

    // text
    const textQuestion = within(text).getByTestId(questionRegExp);
    expect(textQuestion).toHaveTextContent('Text Item');

    const textTable = within(text).getByTestId(textTableRegExp);
    expect(textTable).toBeInTheDocument();

    // multiSelect
    const multiSelectQuestion = within(multiSelect).getByTestId(questionRegExp);
    expect(multiSelectQuestion).toHaveTextContent('Multi Select Item');

    const multiSelectChart = within(multiSelect).getByTestId(multiScatterChart);
    expect(multiSelectChart).toBeInTheDocument();

    // timePicker
    const timePickerQuestion = within(timePicker).getByTestId(questionRegExp);
    expect(timePickerQuestion).toHaveTextContent('Time Picker Item');

    const timePickerChart = within(timePicker).getByTestId(timePickerLineChart);
    expect(timePickerChart).toBeInTheDocument();

    // timeRange
    const timeRangeQuestion = within(timeRange).getByTestId(questionRegExp);
    expect(timeRangeQuestion).toHaveTextContent('Time Range Item');

    const timeRangeUnsupportedText = within(timeRange).getByText('This data type can’t be displayed on this page');
    expect(timeRangeUnsupportedText).toBeInTheDocument();
  });
});

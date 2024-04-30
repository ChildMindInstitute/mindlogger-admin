// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import { format } from 'date-fns';

import { DateFormats, ItemResponseType } from 'shared/consts';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { getResponseItem, getTimeResponseItem } from './ActivityResponses.utils';

const timeResponse1 = { value: { hours: 9, minutes: 15 } };
const timeResponse2 = { hour: 9, minute: 15 };
const expected = format(new Date().setHours(9, 15), DateFormats.Time);

const getActivityItemAnswer = (responseType: ItemResponseType) => ({
  activityItem: {
    responseType,
  },
  answer: {},
});

const singleSelectDataTestid = 'single-select-response-item';
const multiSelectDataTestid = 'multi-select-response-item';
const sliderDataTestid = 'slider-response-item';
const textDataTestid = 'text-response-item';
const numberSelectionDataTestid = 'number-selection-response-item';
const dateDataTestid = 'date-response-item';
const selectionPerRowDataTestid = 'selection-per-row-response-item';
const sliderRowsDataTestid = 'slider-rows-response-item';

jest.mock('../ResponseItems/SingleSelectResponseItem', () => ({
  __esModule: true,
  ...jest.requireActual('../ResponseItems/SingleSelectResponseItem'),
  SingleSelectResponseItem: () => <div data-testid={singleSelectDataTestid} />,
}));

jest.mock('../ResponseItems/MultiSelectResponseItem', () => ({
  __esModule: true,
  ...jest.requireActual('../ResponseItems/MultiSelectResponseItem'),
  MultiSelectResponseItem: () => <div data-testid={multiSelectDataTestid} />,
}));

jest.mock('../ResponseItems/SliderResponseItem', () => ({
  __esModule: true,
  ...jest.requireActual('../ResponseItems/SliderResponseItem'),
  SliderResponseItem: () => <div data-testid={sliderDataTestid} />,
}));

jest.mock('../ResponseItems/TextResponseItem', () => ({
  __esModule: true,
  ...jest.requireActual('../ResponseItems/TextResponseItem'),
  TextResponseItem: () => <div data-testid={textDataTestid} />,
}));

jest.mock('../ResponseItems/NumberSelectionResponseItem', () => ({
  __esModule: true,
  ...jest.requireActual('../ResponseItems/NumberSelectionResponseItem'),
  NumberSelectionResponseItem: () => <div data-testid={numberSelectionDataTestid} />,
}));

jest.mock('../ResponseItems/DateResponseItem', () => ({
  __esModule: true,
  ...jest.requireActual('../ResponseItems/DateResponseItem'),
  DateResponseItem: () => <div data-testid={dateDataTestid} />,
}));

jest.mock('../ResponseItems/SingleMultiSelectPerRowResponseItem', () => ({
  __esModule: true,
  ...jest.requireActual('../ResponseItems/SingleMultiSelectPerRowResponseItem'),
  SingleMultiSelectPerRowResponseItem: () => <div data-testid={selectionPerRowDataTestid} />,
}));

jest.mock('../ResponseItems/SliderRowsResponseItem', () => ({
  __esModule: true,
  ...jest.requireActual('../ResponseItems/SliderRowsResponseItem'),
  SliderRowsResponseItem: () => <div data-testid={sliderRowsDataTestid} />,
}));

describe('getTimeResponseItem', () => {
  test.each`
    answer           | expected     | description
    ${undefined}     | ${undefined} | ${'should return undefined if answer is not provided'}
    ${timeResponse1} | ${expected}  | ${'should return the formatted time when answer contains hours and minutes'}
    ${timeResponse2} | ${expected}  | ${'should use "hour" and "minute" properties if "value" is not provided'}
  `('$description', ({ answer, expected }) => {
    const result = getTimeResponseItem(answer);
    expect(result).toBe(expected);
  });
});

describe('getResponseItem (supported response items), check rendering of child components depending on itemResponseType ', () => {
  test.each`
    itemResponseType                            | expected
    ${ItemResponseType.SingleSelection}         | ${singleSelectDataTestid}
    ${ItemResponseType.MultipleSelection}       | ${multiSelectDataTestid}
    ${ItemResponseType.Slider}                  | ${sliderDataTestid}
    ${ItemResponseType.Text}                    | ${textDataTestid}
    ${ItemResponseType.NumberSelection}         | ${numberSelectionDataTestid}
    ${ItemResponseType.Date}                    | ${dateDataTestid}
    ${ItemResponseType.SingleSelectionPerRow}   | ${selectionPerRowDataTestid}
    ${ItemResponseType.MultipleSelectionPerRow} | ${selectionPerRowDataTestid}
    ${ItemResponseType.SliderRows}              | ${sliderRowsDataTestid}
  `('renders child component for $itemResponseType', ({ itemResponseType, expected }) => {
    renderWithProviders(getResponseItem(getActivityItemAnswer(itemResponseType)));
    expect(screen.getByTestId(expected)).toBeInTheDocument();
  });

  test('renders empty state', () => {
    renderWithProviders(
      getResponseItem({
        activityItem: {
          responseType: ItemResponseType.SingleSelection,
        },
        answer: null,
      }),
    );

    expect(screen.getByTestId('no-response-data')).toBeInTheDocument();
  });

  test('renders child component for time', () => {
    renderWithProviders(
      getResponseItem({
        activityItem: {
          responseType: ItemResponseType.Time,
        },
        answer: {
          hour: 13,
          minute: 5,
        },
      }),
    );

    expect(screen.getByText('13:05')).toBeInTheDocument();
  });

  test('renders child component for time range', () => {
    renderWithProviders(
      getResponseItem({
        activityItem: {
          responseType: ItemResponseType.TimeRange,
        },
        answer: {
          value: {
            from: {
              hour: 7,
              minute: 0,
            },
            to: {
              hour: 17,
              minute: 9,
            },
          },
        },
      }),
    );

    expect(screen.getByDisplayValue('07:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('17:09')).toBeInTheDocument();
  });
});

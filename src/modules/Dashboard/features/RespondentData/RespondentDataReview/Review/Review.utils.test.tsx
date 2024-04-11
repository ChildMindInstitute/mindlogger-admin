// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import { format } from 'date-fns';

import { DateFormats, ItemResponseType } from 'shared/consts';
import { renderWithProviders } from 'shared/utils';

import { getResponseItem, getTimeResponseItem, renderEmptyState } from './Review.utils';

const timeResponse1 = { value: { hours: 9, minutes: 15 } };
const timeResponse2 = { hour: 9, minute: 15 };
const expected = format(new Date().setHours(9, 15), DateFormats.Time);

const emptyReview = 'Select the date, Activity, and response time to review the response data.';
const noDataForActivity = 'No available Data for this Activity yet';

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

jest.mock('../SingleSelectResponseItem', () => ({
  __esModule: true,
  ...jest.requireActual('../SingleSelectResponseItem'),
  SingleSelectResponseItem: () => <div data-testid={singleSelectDataTestid} />,
}));

jest.mock('../MultiSelectResponseItem', () => ({
  __esModule: true,
  ...jest.requireActual('../MultiSelectResponseItem'),
  MultiSelectResponseItem: () => <div data-testid={multiSelectDataTestid} />,
}));

jest.mock('../SliderResponseItem', () => ({
  __esModule: true,
  ...jest.requireActual('../SliderResponseItem'),
  SliderResponseItem: () => <div data-testid={sliderDataTestid} />,
}));

jest.mock('../TextResponseItem', () => ({
  __esModule: true,
  ...jest.requireActual('../TextResponseItem'),
  TextResponseItem: () => <div data-testid={textDataTestid} />,
}));

jest.mock('../NumberSelectionResponseItem', () => ({
  __esModule: true,
  ...jest.requireActual('../NumberSelectionResponseItem'),
  NumberSelectionResponseItem: () => <div data-testid={numberSelectionDataTestid} />,
}));

jest.mock('../DateResponseItem', () => ({
  __esModule: true,
  ...jest.requireActual('../DateResponseItem'),
  DateResponseItem: () => <div data-testid={dateDataTestid} />,
}));

jest.mock('../SingleMultiSelectPerRowResponseItem', () => ({
  __esModule: true,
  ...jest.requireActual('../SingleMultiSelectPerRowResponseItem'),
  SingleMultiSelectPerRowResponseItem: () => <div data-testid={selectionPerRowDataTestid} />,
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

describe('renderEmptyState', () => {
  test.each`
    selectedAnswer                                                       | expected             | description
    ${null}                                                              | ${emptyReview}       | ${'should render empty state when selectedAnswer is nullable'}
    ${{ createdAt: '2023-07-18T08:22:04.604160', answerId: 'answerId' }} | ${noDataForActivity} | ${'should render empty state when selectedAnswer is non-nullable'}
  `('$description', ({ selectedAnswer, expected }) => {
    renderWithProviders(renderEmptyState(selectedAnswer));
    expect(screen.getByText(expected)).toBeInTheDocument();
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
  `('renders child component for $itemResponseType', ({ itemResponseType, expected }) => {
    renderWithProviders(getResponseItem(getActivityItemAnswer(itemResponseType)));
    expect(screen.getByTestId(expected)).toBeInTheDocument();
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

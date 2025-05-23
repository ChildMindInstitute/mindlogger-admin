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
  answer:
    responseType === ItemResponseType.Text || ItemResponseType.ParagraphText ? 'some answer' : {},
});

const singleSelectDataTestid = 'single-select-response-item';
const multiSelectDataTestid = 'multi-select-response-item';
const sliderDataTestid = 'slider-response-item';
const textDataTestid = 'text-response-item';
const numberSelectionDataTestid = 'number-selection-response-item';
const dateDataTestid = 'date-response-item';
const selectionPerRowDataTestid = 'selection-per-row-response-item';
const sliderRowsDataTestid = 'slider-rows-response-item';

vi.mock('../ResponseItems/SingleSelectResponseItem', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    __esModule: true,
    SingleSelectResponseItem: () => <div data-testid={singleSelectDataTestid} />,
  };
});

vi.mock('../ResponseItems/MultiSelectResponseItem', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    __esModule: true,
    MultiSelectResponseItem: () => <div data-testid={multiSelectDataTestid} />,
  };
});

vi.mock('../ResponseItems/SliderResponseItem', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    __esModule: true,
    SliderResponseItem: () => <div data-testid={sliderDataTestid} />,
  };
});

vi.mock('../ResponseItems/TextResponseItem', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    __esModule: true,
    TextResponseItem: () => <div data-testid={textDataTestid} />,
  };
});

vi.mock('../ResponseItems/NumberSelectionResponseItem', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    __esModule: true,
    NumberSelectionResponseItem: () => <div data-testid={numberSelectionDataTestid} />,
  };
});

vi.mock('../ResponseItems/DateResponseItem', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    __esModule: true,
    DateResponseItem: () => <div data-testid={dateDataTestid} />,
  };
});

vi.mock('../ResponseItems/SingleMultiSelectPerRowResponseItem', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    __esModule: true,
    SingleMultiSelectPerRowResponseItem: () => <div data-testid={selectionPerRowDataTestid} />,
  };
});

vi.mock('../ResponseItems/SliderRowsResponseItem', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    __esModule: true,
    SliderRowsResponseItem: () => <div data-testid={sliderRowsDataTestid} />,
  };
});

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
    ${ItemResponseType.ParagraphText}           | ${textDataTestid}
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

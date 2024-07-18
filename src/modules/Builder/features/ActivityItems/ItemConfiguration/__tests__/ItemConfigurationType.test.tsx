// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { ItemResponseType } from 'shared/consts';
import {
  mockedRenderAppletFormDataActivityOptions,
  mockedSingleSelectFormValues,
} from 'shared/mock';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import {
  mockedItemName,
  mockedEmptyItem,
  mockedEmptyAudio,
  mockedEmptyAudioPlayer,
  mockedEmptyDate,
  mockedEmptyDrawing,
  mockedEmptyGeolocation,
  mockedEmptyMessage,
  mockedEmptyMultiSelectRows,
  mockedEmptyMultiSelection,
  mockedEmptyNumberSelection,
  mockedEmptyPhoto,
  mockedEmptySingleSelectRows,
  mockedEmptySingleSelection,
  mockedEmptySlider,
  mockedEmptySliderRows,
  mockedEmptyText,
  mockedEmptyTime,
  mockedEmptyTimeRange,
  mockedEmptyVideo,
  mockedItemTypes,
  mockedItemTypeGroups,
  mockedItemTypesMobileOnly,
  mockedOptionTestid,
  mockedTypeTestid,
  mockedGroupTestid,
  mockedSearchTestid,
  renderItemConfiguration,
  getAppletFormDataWithItem,
  removeUuidValues,
  mockedEmptyParagraphText,
} from '../__mocks__';

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));
const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

describe('ItemConfiguration: Item Type', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableParagraphTextItem: true,
      },
      resetLDContext: jest.fn(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('is rendered with correct item types, groups and "mobile only"', () => {
    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(),
    });

    const type = screen.getByTestId(mockedTypeTestid);
    const typeButton = type.querySelector('[role="button"]');
    fireEvent.mouseDown(typeButton);

    mockedItemTypes.forEach((itemType) => {
      const option = screen.getByTestId(`${mockedOptionTestid}-${itemType}`);

      expect(option).toHaveAttribute('data-value', itemType);

      if (mockedItemTypesMobileOnly.includes(itemType))
        expect(option).toHaveTextContent(/mobile only$/i);
    });
    mockedItemTypeGroups.forEach((groupName) => {
      const group = screen.getByTestId(`${mockedGroupTestid}-${groupName}`);

      expect(group).toBeInTheDocument();
    });
  });

  test.each`
    isReviewable | expected | description
    ${false}     | ${19}    | ${'renders correct number of item types with isReviewable = false'}
    ${true}      | ${3}     | ${'renders correct number of item types with isReviewable = true'}
  `('$description', ({ isReviewable, expected }) => {
    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(mockedEmptyItem, { isReviewable }),
      options: mockedRenderAppletFormDataActivityOptions,
    });

    const type = screen.getByTestId(mockedTypeTestid);
    const typeButton = type.querySelector('[role="button"]');
    fireEvent.mouseDown(typeButton);

    const options = screen.getAllByTestId((testId) => testId.startsWith(mockedOptionTestid));

    expect(options).toHaveLength(expected);
  });

  test.each`
    item                            | expected          | description
    ${mockedEmptyItem}              | ${undefined}      | ${'is rendered without value for newly created item'}
    ${mockedSingleSelectFormValues} | ${'singleSelect'} | ${'is rendered with correct value for existing item'}
  `('$description', ({ item, expected }) => {
    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(item),
    });

    expect(
      screen.getByTestId('builder-activity-items-item-configuration-response-type'),
    ).toBeInTheDocument();

    const input = document.querySelector(
      '[data-testid="builder-activity-items-item-configuration-response-type"] input',
    );
    expected ? expect(input).toHaveValue(expected) : expect(input).not.toHaveValue();
  });

  test.each`
    searchText   | expected | description
    ${'select'}  | ${5}     | ${'search shows only existing item types and highlights matched text'}
    ${'selectt'} | ${0}     | ${'search shows empty result if there are no matches'}
  `('$description', ({ searchText, expected }) => {
    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(),
    });

    const type = screen.getByTestId(mockedTypeTestid);
    const typeButton = type.querySelector('[role="button"]');
    fireEvent.mouseDown(typeButton);

    const search = screen.getByTestId(mockedSearchTestid);
    const searchInput = search.querySelector('input');
    fireEvent.change(searchInput, { target: { value: searchText } });

    const itemTypes = screen.getAllByTestId((testId) => testId.startsWith(mockedOptionTestid));
    const visibleItemTypes = itemTypes.filter(
      (itemType) => window.getComputedStyle(itemType).display !== 'none',
    );

    expect(visibleItemTypes).toHaveLength(expected);

    visibleItemTypes.forEach((itemType) => {
      expect(itemType.querySelector('.highlighted-text')).toHaveTextContent(
        new RegExp(`^${searchText}$`, 'i'),
      );
    });

    if (expected === 0) {
      expect(screen.getByTestId(`${mockedTypeTestid}-empty-search`)).toBeVisible();
    }
  });

  test.each`
    itemType                                    | expected                       | description
    ${ItemResponseType.SingleSelection}         | ${mockedEmptySingleSelection}  | ${'selecting SingleSelection sets correct data to the form'}
    ${ItemResponseType.MultipleSelection}       | ${mockedEmptyMultiSelection}   | ${'selecting MultipleSelection sets correct data to the form'}
    ${ItemResponseType.Slider}                  | ${mockedEmptySlider}           | ${'selecting Slider sets correct data to the form'}
    ${ItemResponseType.Date}                    | ${mockedEmptyDate}             | ${'selecting Date sets correct data to the form'}
    ${ItemResponseType.NumberSelection}         | ${mockedEmptyNumberSelection}  | ${'selecting NumberSelection sets correct data to the form'}
    ${ItemResponseType.TimeRange}               | ${mockedEmptyTimeRange}        | ${'selecting TimeRange sets correct data to the form'}
    ${ItemResponseType.SingleSelectionPerRow}   | ${mockedEmptySingleSelectRows} | ${'selecting SingleSelectionPerRow sets correct data to the form'}
    ${ItemResponseType.MultipleSelectionPerRow} | ${mockedEmptyMultiSelectRows}  | ${'selecting MultipleSelectionPerRow sets correct data to the form'}
    ${ItemResponseType.SliderRows}              | ${mockedEmptySliderRows}       | ${'selecting SliderRows sets correct data to the form'}
    ${ItemResponseType.Text}                    | ${mockedEmptyText}             | ${'selecting Text sets correct data to the form'}
    ${ItemResponseType.ParagraphText}           | ${mockedEmptyParagraphText}    | ${'selecting Paragraph Text sets correct data to the form'}
    ${ItemResponseType.Drawing}                 | ${mockedEmptyDrawing}          | ${'selecting Drawing sets correct data to the form'}
    ${ItemResponseType.Photo}                   | ${mockedEmptyPhoto}            | ${'selecting Photo sets correct data to the form'}
    ${ItemResponseType.Video}                   | ${mockedEmptyVideo}            | ${'selecting Video sets correct data to the form'}
    ${ItemResponseType.Geolocation}             | ${mockedEmptyGeolocation}      | ${'selecting Geolocation sets correct data to the form'}
    ${ItemResponseType.Audio}                   | ${mockedEmptyAudio}            | ${'selecting Audio sets correct data to the form'}
    ${ItemResponseType.Message}                 | ${mockedEmptyMessage}          | ${'selecting Message sets correct data to the form'}
    ${ItemResponseType.AudioPlayer}             | ${mockedEmptyAudioPlayer}      | ${'selecting AudioPlayer sets correct data to the form'}
    ${ItemResponseType.Time}                    | ${mockedEmptyTime}             | ${'selecting Time sets correct data to the form'}
  `('$description', async ({ itemType, expected }) => {
    const ref = createRef();

    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(),
      formRef: ref,
    });

    const type = screen.getByTestId(mockedTypeTestid);
    const typeButton = type.querySelector('[role="button"]');
    fireEvent.mouseDown(typeButton);

    const option = screen.getByTestId(`${mockedOptionTestid}-${itemType}`);
    fireEvent.click(option);

    expect(ref.current.getValues(`${mockedItemName}.responseType`)).toEqual(itemType);

    const itemValues = ref.current.getValues(mockedItemName);

    expect(removeUuidValues(itemValues)).toStrictEqual(expected);
  });

  test('when submit with empty value should show validation error', async () => {
    const ref = createRef();

    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(),
      formRef: ref,
    });

    await ref.current.trigger(`${mockedItemName}.responseType`);

    await waitFor(() => {
      expect(screen.getByText('Item Type is required')).toBeVisible();
    });
  });
});

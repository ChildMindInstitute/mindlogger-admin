// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';
import { ItemResponseType } from 'shared/consts';

import { ItemTypeTooltip } from './ItemTypeTooltip';

const renderComponent = (uiType) => {
  const anchorEl = document.createElement('li');
  renderWithProviders(<ItemTypeTooltip uiType={uiType} anchorEl={anchorEl} />);
  expect(screen.getByTestId('tooltip-selection-presentation')).toBeInTheDocument();
};

const tooltipTexts = {
  Date: 'Date selection in the format Month DD, YYYY.',
  NumberSelection: 'Dropdown list of numeric values with a single answer.',
  SingleSelection: 'A list of choices with a single answer.',
  MultipleSelection: 'A list of choices with a multiple answers.',
  SingleSelectionPerRow: 'Matrix format of choices with a single answer per row.',
  MultipleSelectionPerRow: 'Matrix format of choices with a multiple answers per row.',
  Slider: 'A numerical scale with a single answer.',
  SliderRows: 'Rows of numerical scales with a single answer.',
  Time: 'Time selection in the format HH:MM.',
  TimeRange: 'Time Range selection in the format Start Time HH:MM - End Time HH:MM.',
  Text: 'Text input field.',
  Drawing: 'Drawing task.',
  Photo: 'Photo capture task.',
  Video: 'Video capture task.',
  Geolocation: 'Permission for geolocation.',
  Audio: 'Audio record task.',
  Message: 'Formatted message without response options.',
  AudioPlayer: 'Add an audio stimulus for the respondent to listen to.',
};

describe('ItemTypeTooltip', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test.each(Object.entries(tooltipTexts))('renders %s component', (uiType, expectedText) => {
    renderComponent(ItemResponseType[uiType as keyof typeof ItemResponseType]);

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});

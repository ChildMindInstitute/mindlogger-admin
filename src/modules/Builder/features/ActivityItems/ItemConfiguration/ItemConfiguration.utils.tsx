import uniqueId from 'lodash.uniqueid';

import i18n from 'i18n';
import { ItemInputTypes } from 'shared/types';
import { createArray } from 'shared/utils';

import { SelectionRows, SliderOption } from './ItemConfiguration.types';
import {
  DEFAULT_EMPTY_SLIDER,
  DEFAULT_EMPTY_SLIDER_ROWS,
  DEFAULT_EMPTY_SELECTION_ROWS_OPTION,
  DEFAULT_SELECTION_ROWS_SCORE,
  DEFAULT_EMPTY_SELECTION_ROWS_ITEM,
  SELECTION_OPTIONS_COLOR_PALETTE,
} from './ItemConfiguration.const';

const { t } = i18n;

export const getInputTypeTooltip = (): Record<ItemInputTypes, string> => ({
  [ItemInputTypes.SingleSelection]: t('singleSelectionHint'),
  [ItemInputTypes.MultipleSelection]: t('multipleSelectionHint'),
  [ItemInputTypes.Slider]: t('sliderHint'),
  [ItemInputTypes.Date]: t('dateHint'),
  [ItemInputTypes.NumberSelection]: t('numberSelectionHint'),
  [ItemInputTypes.TimeRange]: t('timeRangeHint'),
  [ItemInputTypes.SingleSelectionPerRow]: t('singleSelectionPerRowHint'),
  [ItemInputTypes.MultipleSelectionPerRow]: t('multipleSelectionPerRowHint'),
  [ItemInputTypes.SliderRows]: t('sliderRowsHint'),
  [ItemInputTypes.Text]: t('textHint'),
  [ItemInputTypes.Drawing]: t('drawingHint'),
  [ItemInputTypes.Photo]: t('photoHint'),
  [ItemInputTypes.Video]: t('videoHint'),
  [ItemInputTypes.Geolocation]: t('geolocationHint'),
  [ItemInputTypes.Audio]: t('audioHint'),
  [ItemInputTypes.Message]: t('messageHint'),
  [ItemInputTypes.AudioPlayer]: t('audioPlayerHint'),
});

export const getEmptySliderOption = (isMultiple: boolean): SliderOption => ({
  id: uniqueId('slider-'),
  ...(isMultiple ? DEFAULT_EMPTY_SLIDER_ROWS : DEFAULT_EMPTY_SLIDER),
});

export const getEmptySelectionItem = (scoresQuantity: number) => ({
  ...DEFAULT_EMPTY_SELECTION_ROWS_ITEM,
  id: uniqueId('selection-item-'),
  scores: createArray(scoresQuantity, () => DEFAULT_SELECTION_ROWS_SCORE),
});

export const getEmptySelectionRows = (type: SelectionRows['type']): SelectionRows => ({
  type,
  items: [getEmptySelectionItem(1)],
  options: [{ ...DEFAULT_EMPTY_SELECTION_ROWS_OPTION }],
});

export const getPaletteColor = (paletteName: string, index: number) => {
  const colors = SELECTION_OPTIONS_COLOR_PALETTE.find(({ name }) => name === paletteName)?.colors;

  return colors?.[index % colors?.length];
};

export const getMaxLengthValidationError = ({ max }: { max: number }) =>
  t('visibilityDecreasesOverMaxCharacters', { max });

export const getNumberRequiredValidationError = () => t('numberValueIsRequired');

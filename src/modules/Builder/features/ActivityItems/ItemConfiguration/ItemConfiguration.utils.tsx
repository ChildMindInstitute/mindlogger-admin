import uniqueId from 'lodash.uniqueid';

import i18n from 'i18n';
import { ItemInputTypes } from 'shared/types';

import { SliderOption } from './ItemConfiguration.types';
import { DEFAULT_EMPTY_SLIDER, SELECTION_OPTIONS_COLOR_PALETTE } from './ItemConfiguration.const';

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

export const getEmptySliderOption = (): SliderOption => ({
  id: uniqueId('slider-'),
  ...DEFAULT_EMPTY_SLIDER,
});

export const getPaletteColor = (paletteName: string, index: number) => {
  const colors = SELECTION_OPTIONS_COLOR_PALETTE.find(({ name }) => name === paletteName)?.colors;

  return colors?.[index % colors?.length];
};

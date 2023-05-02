import { v4 as uuidv4 } from 'uuid';

import i18n from 'i18n';
import { ItemResponseType } from 'shared/consts';
import { createArray } from 'shared/utils';
import { SliderItemResponseValues, SliderRowsItemResponseValues } from 'shared/state';

import {
  DEFAULT_EMPTY_SLIDER,
  DEFAULT_EMPTY_SLIDER_ROWS,
  DEFAULT_SELECTION_ROWS_SCORE,
  SELECTION_OPTIONS_COLOR_PALETTE,
  DEFAULT_NUMBER_MIN_VALUE,
  DEFAULT_NUMBER_MAX_VALUE,
} from './ItemConfiguration.const';

const { t } = i18n;

export const getInputTypeTooltip = (): Record<ItemResponseType, string> => ({
  [ItemResponseType.SingleSelection]: t('singleSelectionHint'),
  [ItemResponseType.MultipleSelection]: t('multipleSelectionHint'),
  [ItemResponseType.Slider]: t('sliderHint'),
  [ItemResponseType.Date]: t('dateHint'),
  [ItemResponseType.NumberSelection]: t('numberSelectionHint'),
  [ItemResponseType.TimeRange]: t('timeRangeHint'),
  [ItemResponseType.SingleSelectionPerRow]: t('singleSelectionPerRowHint'),
  [ItemResponseType.MultipleSelectionPerRow]: t('multipleSelectionPerRowHint'),
  [ItemResponseType.SliderRows]: t('sliderRowsHint'),
  [ItemResponseType.Text]: t('textHint'),
  [ItemResponseType.Drawing]: t('drawingHint'),
  [ItemResponseType.Photo]: t('photoHint'),
  [ItemResponseType.Video]: t('videoHint'),
  [ItemResponseType.Geolocation]: t('geolocationHint'),
  [ItemResponseType.Audio]: t('audioHint'),
  [ItemResponseType.Message]: t('messageHint'),
  [ItemResponseType.AudioPlayer]: t('audioPlayerHint'),
  [ItemResponseType.Time]: t('timeHint'),
  [ItemResponseType.Flanker]: '',
  [ItemResponseType.AbTest]: '',
});

export const getEmptySliderOption = ({
  isMultiple,
  hasScores,
}: {
  isMultiple?: boolean;
  hasScores?: boolean;
}): SliderItemResponseValues | SliderRowsItemResponseValues => ({
  ...(isMultiple && { id: uuidv4() }),
  ...(isMultiple ? DEFAULT_EMPTY_SLIDER_ROWS : DEFAULT_EMPTY_SLIDER),
  ...(!hasScores && { scores: undefined }),
});

export const getEmptySelectionItemOption = (hasScores?: boolean) => ({
  id: uuidv4(),
  text: '',
  ...(hasScores && { score: DEFAULT_SELECTION_ROWS_SCORE }),
});

export const getEmptySelectionItemOptions = (length: number, hasScores?: boolean) =>
  createArray(length, () => getEmptySelectionItemOption(hasScores));

export const getEmptySelectionItem = () => ({
  id: uuidv4(),
  rowName: '',
});

export const getPaletteColor = (paletteName: string, index: number) => {
  const colors = SELECTION_OPTIONS_COLOR_PALETTE.find(({ name }) => name === paletteName)?.colors;

  return colors?.[index % colors?.length];
};

export const getEmptyNumberSelection = () => ({
  minValue: DEFAULT_NUMBER_MIN_VALUE,
  maxValue: DEFAULT_NUMBER_MAX_VALUE,
});

export const getDefaultSliderScores = ({ minValue, maxValue }: SliderRowsItemResponseValues) =>
  createArray(maxValue - minValue + 1, (index) => index + 1);

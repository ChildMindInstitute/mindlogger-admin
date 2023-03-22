import uniqueId from 'lodash.uniqueid';

import i18n from 'i18n';
import { ItemInputTypes } from 'shared/types';
import { createArray } from 'shared/utils';

import { SelectionRows, SliderOption } from './ItemConfiguration.types';
import {
  DEFAULT_EMPTY_SLIDER,
  DEFAULT_EMPTY_SELECTION_ROWS_OPTION,
  DEFAULT_SELECTION_ROWS_SCORE,
  DEFAULT_EMPTY_SELECTION_ROWS_ITEM,
  SELECTION_OPTIONS_COLOR_PALETTE,
} from './ItemConfiguration.const';

const { t } = i18n;

export const getInputTypeTooltip = (): Record<ItemInputTypes, string> => ({
  [ItemInputTypes.SingleSelection]: t('provideListChoicesSingleAnswer'),
  [ItemInputTypes.MultipleSelection]: t('provideListChoicesMultipleAnswers'),
  [ItemInputTypes.Slider]: t('createNumericalScale'),
  [ItemInputTypes.Date]: t('promptSelectDate'),
  [ItemInputTypes.NumberSelection]: t('createDropdownNumeric'),
  [ItemInputTypes.TimeRange]: t('promptSelectTimeRange'),
  [ItemInputTypes.SingleSelectionPerRow]: `${t('setupMatrixRadio')} ${t('respondentSelectSingle')}`,
  [ItemInputTypes.MultipleSelectionPerRow]: `${t('setupMatrixCheckboxes')} ${t(
    'respondentSelectMultiple',
  )}`,
  [ItemInputTypes.SliderRows]: t('setupMatrixSliders'),
  [ItemInputTypes.Text]: t('createQuestionWriteAnswer'),
  [ItemInputTypes.Drawing]: t('promptDrawImage'),
  [ItemInputTypes.Photo]: t('promptCapturePhoto'),
  [ItemInputTypes.Video]: t('promptCaptureVideo'),
  [ItemInputTypes.Geolocation]: t('promptAccessLocation'),
  [ItemInputTypes.Audio]: t('promptRecordAudio'),
  [ItemInputTypes.Message]: `${t('addCustomizableMessage')} ${t('noAnswersRequired')}`,
  [ItemInputTypes.AudioPlayer]: `${t('addAudioStimulus')} ${t('noAnswersRequired')}`,
});

export const getEmptySliderOption = (): SliderOption => ({
  id: uniqueId('slider-'),
  ...DEFAULT_EMPTY_SLIDER,
});

export const getEmptySelectionItem = (scoresQuantity: number) => ({
  ...DEFAULT_EMPTY_SELECTION_ROWS_ITEM,
  id: uniqueId('selection-item-'),
  scores: createArray(scoresQuantity, () => DEFAULT_SELECTION_ROWS_SCORE),
});

export const getEmptySelectionRows = (type: SelectionRows['type']): SelectionRows => ({
  type,
  items: [getEmptySelectionItem(1)],
  options: [DEFAULT_EMPTY_SELECTION_ROWS_OPTION],
});

export const getPaletteColor = (paletteName: string, index: number) => {
  const colors = SELECTION_OPTIONS_COLOR_PALETTE.find(({ name }) => name === paletteName)?.colors;

  return colors?.[index % colors?.length];
};

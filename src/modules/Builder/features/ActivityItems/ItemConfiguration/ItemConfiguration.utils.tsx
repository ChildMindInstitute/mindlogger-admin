import uniqueId from 'lodash.uniqueid';

import i18n from 'i18n';
import { ItemResponseType } from 'shared/consts';
import { createArray } from 'shared/utils';

import {
  ItemConfigurationSettings,
  SelectionRows,
  SliderOption,
  SelectionOption,
} from './ItemConfiguration.types';
import {
  DEFAULT_EMPTY_SLIDER,
  DEFAULT_EMPTY_SLIDER_ROWS,
  DEFAULT_EMPTY_SELECTION_ROWS_OPTION,
  DEFAULT_SELECTION_ROWS_SCORE,
  DEFAULT_EMPTY_SELECTION_ROWS_ITEM,
  SELECTION_OPTIONS_COLOR_PALETTE,
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
  [ItemResponseType.Flanker]: '',
  [ItemResponseType.AbTest]: '',
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
  options: [{ ...DEFAULT_EMPTY_SELECTION_ROWS_OPTION, id: uniqueId('selection-option-') }],
});

export const getPaletteColor = (paletteName: string, index: number) => {
  const colors = SELECTION_OPTIONS_COLOR_PALETTE.find(({ name }) => name === paletteName)?.colors;

  return colors?.[index % colors?.length];
};

export const getMaxLengthValidationError = ({ max }: { max: number }) =>
  t('visibilityDecreasesOverMaxCharacters', { max });

export const getNumberRequiredValidationError = () => t('numberValueIsRequired');

export const mapSettingsToResponse = (settings: ItemConfigurationSettings[]) => {
  const hasSetting = (settingName: ItemConfigurationSettings) => settings?.includes(settingName);

  return {
    removeBackButton: !!hasSetting(ItemConfigurationSettings.IsGoBackRemoved),
    skippableItem: !!hasSetting(ItemConfigurationSettings.IsSkippable),
    randomizeOptions: !!hasSetting(ItemConfigurationSettings.HasRandomize),
    addScores: !!hasSetting(ItemConfigurationSettings.HasScores),
    setAlerts: !!hasSetting(ItemConfigurationSettings.HasAlerts),
    addTooltip: !!hasSetting(ItemConfigurationSettings.HasTooltips),
    setPalette: !!hasSetting(ItemConfigurationSettings.HasColorPalette),
    additionalResponseOption: {
      textInputOption: !!hasSetting(ItemConfigurationSettings.HasTextInput),
      textInputRequired: !!hasSetting(ItemConfigurationSettings.IsTextInputRequired),
    },
  };
};

export const mapSelectionOptionsToResponse = (options?: SelectionOption[]) =>
  options?.map((option) => ({
    ...option,
    color: option?.color?.hex,
  }));

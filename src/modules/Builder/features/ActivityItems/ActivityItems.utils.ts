import get from 'lodash.get';
import { ColorResult } from 'react-color';

import { ItemResponseType } from 'shared/consts';
import {
  Item,
  Config,
  SingleAndMultipleSelectionConfig,
  SingleSelectItem,
  MultiSelectItem,
} from 'shared/state';
import { getDictionaryText } from 'shared/utils';

import { ItemConfigurationForm, ItemConfigurationSettings } from './ItemConfiguration';

const SingleAndMultipleSelectionConfiguration: Record<string, ItemConfigurationSettings> = {
  removeBackButton: ItemConfigurationSettings.IsGoBackRemoved,
  skippableItem: ItemConfigurationSettings.IsSkippable,
  randomizeOptions: ItemConfigurationSettings.HasRandomize,
  addScores: ItemConfigurationSettings.HasScores,
  setAlerts: ItemConfigurationSettings.HasAlerts,
  addTooltip: ItemConfigurationSettings.HasTooltips,
  setPalette: ItemConfigurationSettings.HasColorPalette,
  timer: ItemConfigurationSettings.HasTimer,
  'additionalResponseOption.textInputOption': ItemConfigurationSettings.HasTextInput,
  'additionalResponseOption.textInputRequired': ItemConfigurationSettings.IsTextInputRequired,
};

export const getSingleAndMultipleSelectionConfig = (
  config: SingleAndMultipleSelectionConfig,
): ItemConfigurationSettings[] => {
  const settings: ItemConfigurationSettings[] = [];

  Object.keys(SingleAndMultipleSelectionConfiguration).forEach((configKey) => {
    if (configKey === 'timer' && typeof config?.timer !== undefined) {
      return settings.push(ItemConfigurationSettings.HasTimer);
    }

    if (get(config, configKey)) settings.push(SingleAndMultipleSelectionConfiguration[configKey]);
  });

  return settings;
};

export const getSettingsByTypeAndConfig = (type: ItemResponseType | '', config: Config) => {
  if (type === ItemResponseType.SingleSelection || type === ItemResponseType.MultipleSelection) {
    return getSingleAndMultipleSelectionConfig(config as SingleAndMultipleSelectionConfig);
  }

  return [];
};

export const mapApiItemToItemConfigurationForm = (item: Item): ItemConfigurationForm => {
  const { name, question, config, responseType } = item;

  const configuration = {
    name,
    body: getDictionaryText(question),
    itemsInputType: responseType,
    settings: getSettingsByTypeAndConfig(responseType, config),
  } as ItemConfigurationForm;

  if (
    responseType === ItemResponseType.SingleSelection ||
    responseType === ItemResponseType.MultipleSelection
  ) {
    configuration.options = (
      item as SingleSelectItem | MultiSelectItem
    ).responseValues?.options?.map((item) => ({
      ...item,
      color: { hex: item.color } as ColorResult,
      score: item.score ?? undefined,
      tooltip: item.tooltip ?? undefined,
      image: item.tooltip ?? undefined,
    }));
  }

  return configuration;
};

import get from 'lodash.get';
import { ColorResult } from 'react-color';

import { ItemResponseType } from 'shared/consts';
import {
  Item,
  Config,
  SingleAndMultipleSelectionConfig,
  SingleSelectItem,
  MultiSelectItem,
  TextInputConfig,
} from 'shared/state';
import { getDictionaryText } from 'shared/utils';

import { ItemConfigurationForm, ItemConfigurationSettings } from './ItemConfiguration';
import {
  TextInputConfiguration,
  SingleAndMultipleSelectionConfiguration,
} from './ActivityItems.const';

export const getSingleAndMultipleSelectionSettings = (
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

export const getTextInputSettings = (
  config: Omit<TextInputConfig, 'maxResponseLength' | 'correctAnswer'>,
): ItemConfigurationSettings[] => {
  const settings: ItemConfigurationSettings[] = [];

  Object.keys(TextInputConfiguration).forEach((configKey) => {
    if (get(config, configKey)) settings.push(TextInputConfiguration[configKey]);
  });

  return settings;
};

export const getSettingsByTypeAndConfig = (type: ItemResponseType | '', config: Config) => {
  if (type === ItemResponseType.SingleSelection || type === ItemResponseType.MultipleSelection) {
    return getSingleAndMultipleSelectionSettings(config as SingleAndMultipleSelectionConfig);
  }

  if (type === ItemResponseType.Text) return getTextInputSettings(config as TextInputConfig);

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

  if (responseType === ItemResponseType.Text) {
    configuration.textResponseAnswer = (config as TextInputConfig).correctAnswer;
    configuration.textResponseMaxCharacters = (config as TextInputConfig).maxResponseLength;
  }

  return configuration;
};

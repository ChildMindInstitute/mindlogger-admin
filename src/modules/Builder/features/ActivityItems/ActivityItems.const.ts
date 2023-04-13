import { ItemConfigurationSettings } from './ItemConfiguration';

export const SingleAndMultipleSelectionConfiguration: Record<string, ItemConfigurationSettings> = {
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

export const TextInputConfiguration: Record<string, ItemConfigurationSettings> = {
  removeBackButton: ItemConfigurationSettings.IsGoBackRemoved,
  skippableItem: ItemConfigurationSettings.IsSkippable,
  correctAnswerRequired: ItemConfigurationSettings.IsCorrectAnswerRequired,
  numericalResponseRequired: ItemConfigurationSettings.IsNumericalRequired,
  responseDataIdentifier: ItemConfigurationSettings.HasResponseDataIdentifier,
  responseRequired: ItemConfigurationSettings.IsResponseRequired,
};

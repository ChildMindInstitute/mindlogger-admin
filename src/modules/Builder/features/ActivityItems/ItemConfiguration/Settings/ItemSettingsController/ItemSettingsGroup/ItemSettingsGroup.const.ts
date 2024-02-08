import { ItemConfigurationSettings } from 'modules/Builder/features/ActivityItems/ItemConfiguration/ItemConfiguration.types';
import { ItemResponseType } from 'shared/consts';

export const ITEM_SETTINGS_TO_HAVE_TOOLTIP = [
  ItemConfigurationSettings.IsCorrectAnswerRequired,
  ItemConfigurationSettings.IsNumericalRequired,
  ItemConfigurationSettings.HasResponseDataIdentifier,
  ItemConfigurationSettings.IsResponseRequired,
  ItemConfigurationSettings.HasTickMarks,
  ItemConfigurationSettings.HasTickMarksLabels,
  ItemConfigurationSettings.IsContinuous,
  ItemConfigurationSettings.IsPlayAudioOnce,
  ItemConfigurationSettings.HasTextInput,
  ItemConfigurationSettings.IsTextInputRequired,
  ItemConfigurationSettings.HasTimer,
  ItemConfigurationSettings.IsSkippable,
  ItemConfigurationSettings.IsGoBackRemoved,
  ItemConfigurationSettings.IsUndoRemoved,
  ItemConfigurationSettings.IsNavigationMovedToTheTop,
  ItemConfigurationSettings.HasRandomize,
  ItemConfigurationSettings.HasAlerts,
  ItemConfigurationSettings.HasAutoAdvance,
];

export const ITEM_TYPES_TO_HAVE_ALERTS = [
  ItemResponseType.Slider,
  ItemResponseType.SliderRows,
  ItemResponseType.SingleSelection,
  ItemResponseType.MultipleSelection,
  ItemResponseType.SingleSelectionPerRow,
  ItemResponseType.MultipleSelectionPerRow,
];

export const DEFAULT_ACTIVE_TIMER_VALUE = 1;

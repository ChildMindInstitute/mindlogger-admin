import { ItemResponseType } from 'shared/state';

import { ItemConfigurationSettings } from '../../ItemConfiguration.types';
import { ItemSettingsOptionsByInputType } from './ItemSettingsController.types';

export enum ItemSettingsGroupNames {
  ResponseOptions = 'responseOptions',
  AdditionalResponseOptions = 'additionalResponseOptions',
  ScreenConfigurationsAndTimer = 'screenConfigurationsAndTimer',
  ScoresAndAlerts = 'scoresAndAlerts',
  AudioPlayerOptions = 'audioPlayerOptions',
  ScreenConfigurations = 'screenConfigurations',
}

export const itemSettingsOptionsByInputType: ItemSettingsOptionsByInputType = {
  [ItemResponseType.SingleSelection]: [
    {
      groupName: ItemSettingsGroupNames.ResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.HasColorPalette,
        ItemConfigurationSettings.HasTooltips,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.AdditionalResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsTextInputRequired,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.HasTimer,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasRandomize,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScoresAndAlerts,
      groupOptions: [ItemConfigurationSettings.HasScores, ItemConfigurationSettings.HasAlerts],
    },
  ],
  [ItemResponseType.MultipleSelection]: [
    {
      groupName: ItemSettingsGroupNames.ResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.HasColorPalette,
        ItemConfigurationSettings.HasTooltips,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.AdditionalResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsTextInputRequired,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.HasTimer,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasRandomize,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScoresAndAlerts,
      groupOptions: [ItemConfigurationSettings.HasScores, ItemConfigurationSettings.HasAlerts],
    },
  ],
  [ItemResponseType.Slider]: [
    {
      groupName: ItemSettingsGroupNames.ResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.HasTickMarks,
        ItemConfigurationSettings.HasTickMarksLabels,
        ItemConfigurationSettings.IsContinuous,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.AdditionalResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsTextInputRequired,
      ],
      collapsedByDefault: true,
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.HasTimer,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
      ],
      collapsedByDefault: true,
    },
    {
      groupName: ItemSettingsGroupNames.ScoresAndAlerts,
      groupOptions: [ItemConfigurationSettings.HasScores, ItemConfigurationSettings.HasAlerts],
      collapsedByDefault: true,
    },
  ],
  [ItemResponseType.Date]: [
    {
      groupName: ItemSettingsGroupNames.AdditionalResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsTextInputRequired,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.HasTimer,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
      ],
    },
  ],
  [ItemResponseType.NumberSelection]: [
    {
      groupName: ItemSettingsGroupNames.AdditionalResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsTextInputRequired,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
      ],
    },
  ],
  [ItemResponseType.TimeRange]: [
    {
      groupName: ItemSettingsGroupNames.AdditionalResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsTextInputRequired,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.HasTimer,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
      ],
    },
  ],
  [ItemResponseType.Geolocation]: [
    {
      groupName: ItemSettingsGroupNames.AdditionalResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsTextInputRequired,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.HasTimer,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
      ],
    },
  ],
  [ItemResponseType.Audio]: [
    {
      groupName: ItemSettingsGroupNames.AdditionalResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsTextInputRequired,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.HasTimer,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
      ],
    },
  ],
  [ItemResponseType.SingleSelectionPerRow]: [
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.HasTimer,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScoresAndAlerts,
      groupOptions: [ItemConfigurationSettings.HasScores, ItemConfigurationSettings.HasAlerts],
    },
  ],
  [ItemResponseType.MultipleSelectionPerRow]: [
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.HasTimer,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScoresAndAlerts,
      groupOptions: [ItemConfigurationSettings.HasScores, ItemConfigurationSettings.HasAlerts],
    },
  ],
  [ItemResponseType.SliderRows]: [
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.HasTimer,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScoresAndAlerts,
      groupOptions: [ItemConfigurationSettings.HasScores, ItemConfigurationSettings.HasAlerts],
    },
  ],
  [ItemResponseType.Text]: [
    {
      groupName: ItemSettingsGroupNames.ResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.IsCorrectAnswerRequired,
        ItemConfigurationSettings.IsNumericalRequired,
        ItemConfigurationSettings.HasResponseDataIdentifier,
        ItemConfigurationSettings.IsResponseRequired,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurations,
      groupOptions: [
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
      ],
    },
  ],
  [ItemResponseType.Drawing]: [
    {
      groupName: ItemSettingsGroupNames.AdditionalResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsTextInputRequired,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.HasTimer,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.IsUndoRemoved,
        ItemConfigurationSettings.IsNavigationMovedToTheTop,
      ],
    },
  ],
  [ItemResponseType.Photo]: [
    {
      groupName: ItemSettingsGroupNames.AdditionalResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsTextInputRequired,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.HasTimer,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
      ],
    },
  ],
  [ItemResponseType.Video]: [
    {
      groupName: ItemSettingsGroupNames.AdditionalResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsTextInputRequired,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.HasTimer,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
      ],
    },
  ],
  [ItemResponseType.Message]: [
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [ItemConfigurationSettings.HasTimer, ItemConfigurationSettings.IsGoBackRemoved],
    },
  ],
  [ItemResponseType.AudioPlayer]: [
    {
      groupName: ItemSettingsGroupNames.AudioPlayerOptions,
      groupOptions: [ItemConfigurationSettings.IsPlayAudioOnce],
    },
    {
      groupName: ItemSettingsGroupNames.AdditionalResponseOptions,
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsTextInputRequired,
      ],
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurations,
      groupOptions: [
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
      ],
    },
  ],
};

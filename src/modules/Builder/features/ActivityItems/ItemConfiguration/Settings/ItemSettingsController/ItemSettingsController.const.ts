import { ItemInputTypes } from 'shared/types';

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
  [ItemInputTypes.SingleSelection]: [
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
  [ItemInputTypes.MultipleSelection]: [
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
  [ItemInputTypes.Slider]: [
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
  [ItemInputTypes.Date]: [
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
  [ItemInputTypes.NumberSelection]: [
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
  [ItemInputTypes.TimeRange]: [
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
  [ItemInputTypes.Geolocation]: [
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
  [ItemInputTypes.Audio]: [
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
  [ItemInputTypes.SingleSelectionPerRow]: [
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
  [ItemInputTypes.MultipleSelectionPerRow]: [
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
  [ItemInputTypes.SliderRows]: [
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
  [ItemInputTypes.Text]: [
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
  [ItemInputTypes.Drawing]: [
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
  [ItemInputTypes.Photo]: [
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
  [ItemInputTypes.Video]: [
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
  [ItemInputTypes.Message]: [
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [ItemConfigurationSettings.HasTimer, ItemConfigurationSettings.IsGoBackRemoved],
    },
  ],
  [ItemInputTypes.AudioPlayer]: [
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

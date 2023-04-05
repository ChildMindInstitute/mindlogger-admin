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
      collapsedByDefault: true,
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.HasTimer,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasRandomize,
      ],
      collapsedByDefault: true,
    },
    {
      groupName: ItemSettingsGroupNames.ScoresAndAlerts,
      groupOptions: [ItemConfigurationSettings.HasScores, ItemConfigurationSettings.HasAlerts],
      collapsedByDefault: true,
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
      collapsedByDefault: true,
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
      groupOptions: [
        ItemConfigurationSettings.HasTimer,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasRandomize,
      ],
      collapsedByDefault: true,
    },
    {
      groupName: ItemSettingsGroupNames.ScoresAndAlerts,
      groupOptions: [ItemConfigurationSettings.HasScores, ItemConfigurationSettings.HasAlerts],
      collapsedByDefault: true,
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
      collapsedByDefault: true,
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
      collapsedByDefault: true,
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
      collapsedByDefault: true,
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
      collapsedByDefault: true,
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
      collapsedByDefault: true,
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
      collapsedByDefault: true,
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
      collapsedByDefault: true,
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
      collapsedByDefault: true,
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
      collapsedByDefault: true,
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
      collapsedByDefault: true,
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
      collapsedByDefault: true,
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
      collapsedByDefault: true,
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
      collapsedByDefault: true,
    },
    {
      groupName: ItemSettingsGroupNames.ScreenConfigurations,
      groupOptions: [
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
      ],
      collapsedByDefault: true,
    },
  ],
};

import { ItemInputTypes } from 'shared/types/activityItems';

import { ItemConfigurationSettings } from '../../ItemConfiguration.types';
import { ItemSettingsOptionsByInputType } from './ItemSettingsController.types';

export const itemSettingsOptionsByInputType: ItemSettingsOptionsByInputType = {
  [ItemInputTypes.SingleSelection]: [
    {
      groupName: 'responseSettings',
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.HasScores,
        ItemConfigurationSettings.HasTooltips,
        ItemConfigurationSettings.HasAlerts,
      ],
    },
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.HasColorPalette,
        ItemConfigurationSettings.HasRandomize,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasTimer,
      ],
    },
  ],
  [ItemInputTypes.MultipleSelection]: [
    {
      groupName: 'responseSettings',
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.HasScores,
        ItemConfigurationSettings.HasTooltips,
        ItemConfigurationSettings.HasAlerts,
      ],
    },
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.HasColorPalette,
        ItemConfigurationSettings.HasRandomize,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasTimer,
      ],
    },
  ],
  [ItemInputTypes.Slider]: [
    {
      groupName: 'responseSettings',
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.HasScores,
        ItemConfigurationSettings.HasTooltips,
      ],
    },
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.HasTickMarks,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasTickMarksLabels,
        ItemConfigurationSettings.HasLabels,
        ItemConfigurationSettings.IsContinuous,
        ItemConfigurationSettings.HasTimer,
      ],
    },
  ],
  [ItemInputTypes.Date]: [
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasTimer,
      ],
    },
  ],
  [ItemInputTypes.NumberSelection]: [
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
      ],
    },
  ],
  [ItemInputTypes.TimeRange]: [
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasTimer,
      ],
    },
  ],
  [ItemInputTypes.SingleSelectionPerRow]: [
    {
      groupName: 'responseSettings',
      groupOptions: [ItemConfigurationSettings.HasScores, ItemConfigurationSettings.HasAlerts],
    },
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasTimer,
      ],
    },
  ],
  [ItemInputTypes.MultipleSelectionPerRow]: [
    {
      groupName: 'responseSettings',
      groupOptions: [ItemConfigurationSettings.HasScores, ItemConfigurationSettings.HasAlerts],
    },
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasTimer,
      ],
    },
  ],
  [ItemInputTypes.SliderRows]: [
    {
      groupName: 'responseSettings',
      groupOptions: [ItemConfigurationSettings.HasScores, ItemConfigurationSettings.HasAlerts],
    },
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasTimer,
      ],
    },
  ],
  [ItemInputTypes.Text]: [
    {
      groupName: 'responseSettings',
      groupOptions: [
        ItemConfigurationSettings.IsResponseRequired,
        ItemConfigurationSettings.IsCorrectAnswerRequired,
        ItemConfigurationSettings.IsNumericalRequired,
      ],
    },
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasResponseDataIdentifier,
      ],
    },
  ],
  [ItemInputTypes.Drawing]: [
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.IsUndoChangesForbidden,
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.HasMoreNavigationButtons,
        ItemConfigurationSettings.HasTimer,
      ],
    },
  ],
  [ItemInputTypes.Photo]: [
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.HasTimer,
      ],
    },
  ],
  [ItemInputTypes.Video]: [
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.HasTimer,
      ],
    },
  ],
  [ItemInputTypes.Geolocation]: [
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasTimer,
      ],
    },
  ],
  [ItemInputTypes.Audio]: [
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsSkippable,
        ItemConfigurationSettings.IsGoBackRemoved,
        ItemConfigurationSettings.HasTimer,
      ],
    },
  ],
  [ItemInputTypes.Message]: [],
  [ItemInputTypes.AudioPlayer]: [
    {
      groupName: 'itemSettings',
      groupOptions: [
        ItemConfigurationSettings.HasTextInput,
        ItemConfigurationSettings.IsMediaReplayAllowed,
      ],
    },
  ],
};

import { ColorResult } from 'react-color';
import { FieldValues, Path } from 'react-hook-form';

import { ItemFormValues, ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';

export enum ItemConfigurationSettings {
  HasScores = 'addScores',
  HasTooltips = 'addTooltip',
  HasAlerts = 'setAlerts',
  HasTextInput = 'additionalResponseOption.textInputOption',
  HasTickMarks = 'showTickMarks',
  HasTickMarksLabels = 'showTickLabels',
  HasColorPalette = 'setPalette',
  HasRandomize = 'randomizeOptions',
  HasResponseDataIdentifier = 'responseDataIdentifier',
  HasTimer = 'timer',
  HasAutoAdvance = 'autoAdvance',
  IsCorrectAnswerRequired = 'correctAnswerRequired',
  IsNumericalRequired = 'numericalResponseRequired',
  IsResponseRequired = 'responseRequired',
  IsSkippable = 'skippableItem',
  IsContinuous = 'continuousSlider',
  IsPlayAudioOnce = 'playOnce',
  IsGoBackRemoved = 'removeBackButton',
  IsTextInputRequired = 'additionalResponseOption.textInputRequired',
  IsUndoRemoved = 'removeUndoButton',
  IsNavigationMovedToTheTop = 'navigationToTop',
  PortraitLayout = 'portraitLayout',
}

export type SelectionOption = {
  id: string;
  text: string;
  score?: number;
  tooltip?: string;
  isHidden?: boolean;
  image?: string;
  color?: ColorResult;
};

export type Alert = {
  key: string;
  value: string | number;
  alert: string | null;
};

export type ItemsOption = {
  value: ItemResponseTypeNoPerfTasks;
  icon: JSX.Element;
  isMobileOnly?: boolean;
};

export type ItemsOptionGroup = {
  groupName: string;
  groupOptions: ItemsOption[];
};

export type OptionalItemSetupProps = {
  itemType: ItemResponseTypeNoPerfTasks;
  name: Path<FieldValues>;
  defaultValue?: unknown;
};

export type ItemConfigurationProps = {
  name: string;
  onClose: () => void;
};

export type GetEmptyAlert = Partial<ItemFormValues>;

export type UseWatchItemConfiguration = [boolean, ItemResponseTypeNoPerfTasks, ItemFormValues];

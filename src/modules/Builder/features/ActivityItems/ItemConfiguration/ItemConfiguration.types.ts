import { ColorResult } from 'react-color';
import { FieldValues, Path } from 'react-hook-form';

// import { ItemResponseType } from 'shared/consts';
import { ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';

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
  message: string;
  option: string;
  item?: string;
  slider?: string;
  min?: string;
  max?: string;
};

export type ItemsOption = {
  // value: ItemResponseType;
  value: ItemResponseTypeNoPerfTasks;
  icon: JSX.Element;
  isMobileOnly?: boolean;
};

export type ItemsOptionGroup = {
  groupName: string;
  groupOptions: ItemsOption[];
};

export type OptionalItemSetupProps = {
  // itemType: ItemResponseType;
  itemType: ItemResponseTypeNoPerfTasks;
  name: Path<FieldValues>;
  defaultValue?: unknown;
};

export type ItemConfigurationProps = {
  name: string;
  onClose: () => void;
};

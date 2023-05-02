import { ColorResult } from 'react-color';
import { FieldValues, Path } from 'react-hook-form';

import { ItemResponseType } from 'shared/consts';

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
  IsPlayAudioOnce = 'isPlayAudioOnce',
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

export type SelectionRowsItem = {
  id: string;
  label: string;
  tooltip?: string;
  scores?: number[];
  image?: string;
};

export type SelectionRowsOption = {
  id: string;
  label: string;
  tooltip?: string;
  image?: string;
};

export type SelectionRows = {
  items: SelectionRowsItem[];
  options: SelectionRowsOption[];
  type: ItemResponseType.MultipleSelectionPerRow | ItemResponseType.SingleSelectionPerRow;
};

export type ItemsOption = {
  value: ItemResponseType;
  icon: JSX.Element;
};

export type ItemsOptionGroup = {
  groupName: string;
  groupOptions: ItemsOption[];
};

export type OptionalItemSetupProps = {
  itemType: ItemResponseType;
  name: Path<FieldValues>;
  defaultValue?: unknown;
};

export type ItemConfigurationProps = {
  name: string;
  onClose: () => void;
};

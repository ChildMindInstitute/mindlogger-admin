import { ColorResult } from 'react-color';

import { ItemInputTypes } from 'shared/types/activityItems';

export enum ItemConfigurationSettings {
  HasScores = 'hasScores',
  HasTooltips = 'hasTooltips',
  HasAlerts = 'hasAlerts',
  HasTextInput = 'hasInput',
  HasTickMarks = 'hasTickMarks',
  HasTickMarksLabels = 'hasTickMarksLabels',
  HasColorPalette = 'hasColorPallete',
  HasRandomize = 'hasRandomize',
  HasMoreNavigationButtons = 'hasMoreNavigationButtons',
  HasResponseDataIdentifier = 'hasResponseDataIdentifier',
  HasTimer = 'hasTimer',
  HasLabels = 'hasLabels',
  IsResponseRequired = 'isResponseRequired',
  IsCorrectAnswerRequired = 'isCorrectAnswerRequired',
  IsNumericalRequired = 'isNumericalRequired',
  IsSkippable = 'isSkippable',
  IsContinuous = 'isContinuous',
  IsMediaReplayAllowed = 'isMediaReplayAllowed',
  IsUndoChangesForbidden = 'isUndoChangesForbidden',
  IsGoBackRemoved = 'isGoBackRemoved',
}

export type SelectionOption = {
  text: string;
  score?: number;
  tooltip?: string;
  isVisible?: boolean;
  image?: string;
  color?: ColorResult;
};

export type Alert = {
  message: string;
  option: string;
  item: string;
};

export type ItemConfigurationForm = {
  itemsInputType: ItemInputTypes | '';
  name: string;
  body: string;
  settings: ItemConfigurationSettings[];
  timer: number;
  options?: SelectionOption[];
  isTextInputOptionRequired: boolean;
  minNumber: number;
  maxNumber: number;
  alerts?: Alert[];
};

export type ItemsOption = {
  value: ItemInputTypes;
  icon: JSX.Element;
};

export type ItemsOptionGroup = {
  groupName: string;
  groupOptions: ItemsOption[];
};

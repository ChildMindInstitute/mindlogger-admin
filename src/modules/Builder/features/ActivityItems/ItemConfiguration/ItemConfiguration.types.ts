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

export type SelectionRowsItem = {
  label: string;
  tooltip?: string;
  scores?: number[];
  image?: string;
};

export type SelectionRowsOption = {
  label: string;
  tooltip?: string;
  image?: string;
};

export type SelectionRows = {
  items: SelectionRowsItem[];
  options: SelectionRowsOption[];
  type: ItemInputTypes.MultipleSelectionPerRow | ItemInputTypes.SingleSelectionPerRow;
};

export type ItemConfigurationForm = {
  itemsInputType: ItemInputTypes | '';
  name: string;
  body: string;
  settings: ItemConfigurationSettings[];
  timer?: number;
  options?: SelectionOption[];
  isTextInputOptionRequired?: boolean;
  minNumber?: number;
  maxNumber?: number;
  alerts?: Alert[];
  audioDuration?: number;
  sliderOptions?: SliderOption[];
  textResponseAnswer?: string;
  textResponseMaxCharacters?: number;
  selectionRows?: SelectionRows;
};

export type ItemsOption = {
  value: ItemInputTypes;
  icon: JSX.Element;
};

export type ItemsOptionGroup = {
  groupName: string;
  groupOptions: ItemsOption[];
};

export type SliderOption = {
  id: string;
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
  minImage?: string;
  maxImage?: string;
  scores: number[];
};

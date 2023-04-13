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
  IsUndoRemoved = 'isUndoRemoved',
  IsNavigationMovedToTheTop = 'isNavigationMovedToTheTop',
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

export type ItemConfigurationForm = {
  itemsInputType: ItemResponseType | '';
  name: string;
  body: string;
  settings: ItemConfigurationSettings[];
  timer?: number;
  options?: SelectionOption[];
  paletteName?: string;
  isTextInputOptionRequired?: boolean;
  minNumber?: number;
  maxNumber?: number;
  alerts?: Alert[];
  audioDuration?: number;
  sliderOptions?: SliderOption[];
  textResponseAnswer?: string;
  textResponseMaxCharacters?: number;
  selectionRows?: SelectionRows;
  mediaTranscript?: string;
  mediaFileResource?: string;
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

export type SliderOption = {
  id?: string;
  minValue: number;
  maxValue: number;
  minLabel?: string;
  maxLabel?: string;
  minImage?: string;
  maxImage?: string;
  scores: number[];
  label?: string;
};

export type ItemConfigurationProps = {
  name: string;
  onClose: () => void;
};

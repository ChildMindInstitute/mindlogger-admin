import { ColorResult } from 'react-color';
import {
  Control,
  FieldValues,
  Path,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
  UseFormRegister,
  UseFormUnregister,
} from 'react-hook-form';

import { ItemInputTypes } from 'shared/types';

export enum ItemConfigurationSettings {
  HasScores = 'hasScores',
  HasTooltips = 'hasTooltips',
  HasAlerts = 'hasAlerts',
  HasTextInput = 'hasInput',
  HasTickMarks = 'hasTickMarks',
  HasTickMarksLabels = 'hasTickMarksLabels',
  HasColorPalette = 'hasColorPallete',
  HasRandomize = 'hasRandomize',
  HasResponseDataIdentifier = 'hasResponseDataIdentifier',
  HasTimer = 'hasTimer',
  IsCorrectAnswerRequired = 'isCorrectAnswerRequired',
  IsNumericalRequired = 'isNumericalRequired',
  IsResponseRequired = 'isResponseRequired',
  IsSkippable = 'isSkippable',
  IsContinuous = 'isContinuous',
  IsPlayAudioOnce = 'isPlayAudioOnce',
  IsGoBackRemoved = 'isGoBackRemoved',
  IsTextInputRequired = 'isTextInputRequired',
  IsUndoRemoved = 'isUndoRemoved',
  IsNavigationMovedToTheTop = 'isNavigationMovedToTheTop',
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
  id?: string;
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
  value: ItemInputTypes;
  icon: JSX.Element;
};

export type ItemsOptionGroup = {
  groupName: string;
  groupOptions: ItemsOption[];
};

export type SettingsSetupProps = {
  control: Control<ItemConfigurationForm>;
  setValue: UseFormSetValue<ItemConfigurationForm>;
  getValues: UseFormGetValues<ItemConfigurationForm>;
  watch: UseFormWatch<ItemConfigurationForm>;
  register: UseFormRegister<ItemConfigurationForm>;
  unregister: UseFormUnregister<ItemConfigurationForm>;
};

export type OptionalItemSetupProps = {
  itemType: ItemInputTypes;
  name: Path<FieldValues>;
  defaultValue?: unknown;
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

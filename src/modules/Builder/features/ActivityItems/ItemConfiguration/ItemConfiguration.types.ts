import { ColorResult } from 'react-color';
import {
  Control,
  FieldValues,
  Path,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
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

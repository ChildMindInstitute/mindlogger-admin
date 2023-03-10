import { ColorResult } from 'react-color';

export enum ItemInputTypes {
  SingleSelection = 'singleSelection',
  MultipleSelection = 'multipleSelection',
  Slider = 'slider',
  Date = 'date',
  NumberSelection = 'numberSelection',
  TimeRange = 'timeRange',
  SingleSelectionPerRow = 'singleSelectionPerRow',
  MultipleSelectionPerRow = 'multipleSelectionPerRow',
  SliderRows = 'sliderRows',
  Text = 'text',
  Drawing = 'drawing',
  Photo = 'photo',
  Video = 'video',
  Geolocation = 'geolocation',
  Audio = 'audio',
  Message = 'message',
  AudioPlayer = 'audioPlayer',
}

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
  startTime: string;
  endTime: string;
};

export type ItemsOption = {
  value: ItemInputTypes;
  icon: JSX.Element;
};

export type ItemsOptionGroup = {
  groupName: string;
  groupOptions: ItemsOption[];
};

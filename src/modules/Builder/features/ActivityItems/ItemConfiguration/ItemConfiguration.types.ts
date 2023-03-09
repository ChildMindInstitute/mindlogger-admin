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

export type ItemConfigurationForm = {
  itemsInputType: ItemInputTypes | '';
  settings: ItemConfigurationSettings[];
  timer: number;
  isTextInputOptionRequired: boolean;
  minNumber: number;
  maxNumber: number;
};

export type ItemsOption = {
  value: ItemInputTypes;
  icon: JSX.Element;
};

export type ItemsOptionGroup = {
  groupName: string;
  groupOptions: ItemsOption[];
};

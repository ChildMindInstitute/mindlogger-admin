import { ItemResponseType } from 'shared/consts';

import { DEFAULT_MAX_CHARACTERS, DEFAULT_DISABLED_TIMER_VALUE } from '../ItemConfiguration.const';

export const DEFAULT_OPTION_VALUE = 0;
export const ITEMS_TO_HAVE_RESPONSE_OPTIONS_HEADER = [
  ItemResponseType.SingleSelection,
  ItemResponseType.MultipleSelection,
  ItemResponseType.Slider,
  ItemResponseType.Date,
  ItemResponseType.NumberSelection,
  ItemResponseType.TimeRange,
  ItemResponseType.Time,
  ItemResponseType.Geolocation,
  ItemResponseType.Audio,
  ItemResponseType.AudioPlayer,
  ItemResponseType.SingleSelectionPerRow,
  ItemResponseType.MultipleSelectionPerRow,
  ItemResponseType.SliderRows,
  ItemResponseType.Text,
  ItemResponseType.Drawing,
  ItemResponseType.Photo,
  ItemResponseType.Video,
];
export const ITEMS_WITH_DOWNLOAD_HEADER = [ItemResponseType.PhrasalTemplate];

export const defaultSingleAndMultiSelectionRowsConfig = {
  removeBackButton: false,
  skippableItem: false,
  timer: 0,
  addScores: false,
  setAlerts: false,
  addTooltip: false,
};

export const defaultMultiSelectionConfig = {
  removeBackButton: false,
  skippableItem: false,
  randomizeOptions: false,
  addScores: false,
  setAlerts: false,
  addTooltip: false,
  setPalette: false,
  timer: DEFAULT_DISABLED_TIMER_VALUE,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
};

export const defaultSingleSelectionConfig = {
  ...defaultMultiSelectionConfig,
  autoAdvance: false,
};

export const defaultTextConfig = {
  removeBackButton: false,
  skippableItem: false,
  maxResponseLength: DEFAULT_MAX_CHARACTERS,
  correctAnswerRequired: false,
  correctAnswer: '',
  numericalResponseRequired: false,
  responseDataIdentifier: false,
  responseRequired: false,
};

export const defaultSliderConfig = {
  removeBackButton: false,
  skippableItem: false,
  addScores: false,
  setAlerts: false,
  showTickMarks: false,
  showTickLabels: false,
  continuousSlider: false,
  timer: DEFAULT_DISABLED_TIMER_VALUE,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
};

export const defaultAudioAndVideoConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
  timer: 0,
};

export const defaultAudioPlayerConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
  playOnce: false,
};

export const defaultSliderRowsConfig = {
  removeBackButton: false,
  skippableItem: false,
  addScores: false,
  setAlerts: false,
  timer: 0,
};

export const defaultNumberSelectionConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
  timer: 0,
};

export const defaultDateAndTimeRangeConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
  timer: DEFAULT_DISABLED_TIMER_VALUE,
};

export const defaultDrawingConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
  timer: 0,
  removeUndoButton: false,
  navigationToTop: false,
};

export const defaultPhotoConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
  timer: 0,
};

export const defaultGeolocationConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
  timer: 0,
};

export const defaultMessageConfig = {
  removeBackButton: false,
  timer: 0,
};

export const defaultTimeConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
  timer: 0,
};

export const defaultPhrasalTemplateConfig = {
  skippableItem: false,
  timer: 0,
};

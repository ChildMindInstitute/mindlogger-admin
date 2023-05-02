import { DEFAULT_MAX_CHARACTERS, DEFAULT_DISABLED_TIMER_VALUE } from '../ItemConfiguration.const';

export const defaultSingleAndMultiSelectionConfig = {
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

export const defaultNumberSelectionConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
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

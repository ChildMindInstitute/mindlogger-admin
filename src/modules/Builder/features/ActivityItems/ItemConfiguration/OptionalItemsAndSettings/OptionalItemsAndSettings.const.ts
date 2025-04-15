import { ItemResponseType } from 'shared/consts';
import {
  AudioAndVideoConfig,
  AudioPlayerConfig,
  DateAndTimeRangeConfig,
  DrawingConfig,
  GeolocationConfig,
  MessageConfig,
  MultipleSelectionConfig,
  NumberConfig,
  ParagraphTextInputConfig,
  PhotoConfig,
  PhrasalTemplateConfig,
  RequestHealthRecordDataConfig,
  SingleAndMultiplePerRowConfig,
  SingleSelectionConfig,
  SliderConfig,
  SliderRowsConfig,
  TextInputConfig,
} from 'shared/state';

import {
  DEFAULT_DISABLED_TIMER_VALUE,
  DEFAULT_MAX_CHARACTERS_PARAGRAPH_TEXT,
  DEFAULT_MAX_CHARACTERS_SHORT_TEXT,
} from '../ItemConfiguration.const';

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
  ItemResponseType.ParagraphText,
  ItemResponseType.Drawing,
  ItemResponseType.Photo,
  ItemResponseType.Video,
  ItemResponseType.RequestHealthRecordData,
];
export const ITEMS_WITH_DOWNLOAD_HEADER = [ItemResponseType.PhrasalTemplate];

export const defaultSingleAndMultiSelectionRowsConfig: SingleAndMultiplePerRowConfig = {
  removeBackButton: false,
  skippableItem: false,
  timer: 0,
  addScores: false,
  setAlerts: false,
  addTooltip: false,
};

export const defaultMultiSelectionConfig: MultipleSelectionConfig = {
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
  portraitLayout: false,
};

export const defaultSingleSelectionConfig: SingleSelectionConfig = {
  ...defaultMultiSelectionConfig,
  autoAdvance: false,
  responseDataIdentifier: false,
};

export const defaultTextConfig: TextInputConfig = {
  removeBackButton: false,
  skippableItem: false,
  maxResponseLength: DEFAULT_MAX_CHARACTERS_SHORT_TEXT,
  correctAnswerRequired: false,
  correctAnswer: '',
  numericalResponseRequired: false,
  responseDataIdentifier: false,
  responseRequired: false,
};

export const defaultParagraphTextConfig: ParagraphTextInputConfig = {
  removeBackButton: false,
  skippableItem: false,
  maxResponseLength: DEFAULT_MAX_CHARACTERS_PARAGRAPH_TEXT,
  responseRequired: false,
};

export const defaultSliderConfig: SliderConfig = {
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

export const defaultAudioAndVideoConfig: AudioAndVideoConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
  timer: 0,
};

export const defaultAudioPlayerConfig: AudioPlayerConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
  playOnce: false,
};

export const defaultSliderRowsConfig: SliderRowsConfig = {
  removeBackButton: false,
  skippableItem: false,
  addScores: false,
  setAlerts: false,
  timer: 0,
};

export const defaultNumberSelectionConfig: NumberConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
};

export const defaultDateAndTimeRangeConfig: DateAndTimeRangeConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
  timer: DEFAULT_DISABLED_TIMER_VALUE,
};

export const defaultDrawingConfig: DrawingConfig = {
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

export const defaultPhotoConfig: PhotoConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
  timer: 0,
};

export const defaultGeolocationConfig: GeolocationConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
  timer: 0,
};

export const defaultMessageConfig: MessageConfig = {
  removeBackButton: false,
  timer: 0,
};

export const defaultRequestHealthRecordDataConfig: RequestHealthRecordDataConfig = {
  removeBackButton: false,
};

export const defaultTimeConfig: DateAndTimeRangeConfig = {
  removeBackButton: false,
  skippableItem: false,
  additionalResponseOption: {
    textInputOption: false,
    textInputRequired: false,
  },
  timer: 0,
};

export const defaultPhrasalTemplateConfig: PhrasalTemplateConfig = {
  skippableItem: false,
  removeBackButton: false,
  type: 'phrasal_template',
};

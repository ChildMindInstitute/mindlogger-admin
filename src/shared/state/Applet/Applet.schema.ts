import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { ColorResult } from 'react-color';

import { BaseSchema } from 'shared/state/Base';
import { RetentionPeriods } from 'shared/types';
import { AppletBody, AppletId, OwnerId } from 'api';
import { ItemResponseType, SubscaleTotalScore } from 'shared/consts';
import { Encryption } from 'shared/utils';

export type CreateAppletStateData = {
  builder: ActionReducerMapBuilder<AppletSchema>;
  thunk:
    | AsyncThunk<AxiosResponse, AppletId, Record<string, never>>
    | AsyncThunk<AxiosResponse, OwnerId & AppletId, Record<string, never>>
    | AsyncThunk<AxiosResponse, OwnerId & { body: SingleApplet }, Record<string, never>>
    | AsyncThunk<AxiosResponse, AppletBody, Record<string, never>>;
  key: keyof AppletSchema;
};

type ActivityFlowItem = {
  activityId: string;
  id: string;
  order: number;
  activityKey?: string;
  key?: string;
};

export type ActivityFlow = {
  id?: string;
  key?: string;
  name: string;
  description?: string | Record<string, string>;
  isSingleReport?: boolean;
  hideBadge?: boolean;
  order?: number;
  activityIds?: number[];
  items?: ActivityFlowItem[];
  isHidden?: boolean;
};

export type TextInputConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  maxResponseLength: number;
  correctAnswerRequired: boolean;
  correctAnswer: string;
  numericalResponseRequired: boolean;
  responseDataIdentifier: boolean;
  responseRequired: boolean;
};

export type SingleAndMultipleSelectionConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  randomizeOptions: boolean;
  addScores: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
  setPalette: boolean;
  timer: number;
  additionalResponseOption: {
    textInputOption: boolean;
    textInputRequired: boolean;
  };
};

export type SliderConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  addScores: boolean;
  setAlerts: boolean;
  showTickMarks: boolean;
  showTickLabels: boolean;
  continuousSlider: boolean;
  timer: number;
  additionalResponseOption: {
    textInputOption: boolean;
    textInputRequired: boolean;
  };
};

export type AudioAndVideoConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  additionalResponseOption: {
    textInputOption: boolean;
    textInputRequired: boolean;
  };
  timer: number;
};

export type SingleAndMultipleSelectionPerRowConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  timer: number;
  addScores: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
};

export type NumberConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  additionalResponseOption: {
    textInputOption: boolean;
    textInputRequired: boolean;
  };
};

export type DateAndTimeRangeConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  additionalResponseOption: {
    textInputOption: boolean;
    textInputRequired: boolean;
  };
  timer: number;
};

export type AudioPlayerConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  additionalResponseOption: {
    textInputOption: boolean;
    textInputRequired: boolean;
  };
  playOnce: boolean;
};
export type DrawingConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  additionalResponseOption: {
    textInputOption: boolean;
    textInputRequired: boolean;
  };
  timer: number;
  removeUndoButton: boolean;
  navigationToTop: boolean;
};

export type PhotoConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  additionalResponseOption: {
    textInputOption: boolean;
    textInputRequired: boolean;
  };
  timer: number;
};

export type GeolocationConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  additionalResponseOption: {
    textInputOption: boolean;
    textInputRequired: boolean;
  };
  timer: number;
};

export type MessageConfig = {
  skippableItem?: boolean;
  removeBackButton: boolean;
  timer: number;
};

export type SliderRowsConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  addScores: boolean;
  setAlerts: boolean;
  timer: number;
};

export type SliderItemResponseValues = {
  id?: string;
  minLabel: string;
  maxLabel: string;
  minValue: number;
  maxValue: number;
  minImage?: string;
  maxImage?: string;
  scores?: number[];
};

export type SliderRowsItemResponseValues = SliderItemResponseValues & { label: string };

export type SingleAndMultipleSelectionOption = {
  id: string;
  text: string;
  image?: string;
  score?: number;
  tooltip?: string;
  color?: string | ColorResult;
  isHidden?: boolean;
};

export type SingleAndMultipleSelectItemResponseValues = {
  paletteName?: string;
  options: Array<SingleAndMultipleSelectionOption>;
};

export type AudioPlayerResponseValues = {
  file: string;
};

export type AudioResponseValues = {
  maxDuration: number;
};

export type SingleAndMultipleSelectRowOption = {
  id: string;
  text: string;
  image?: string;
  score?: number;
  tooltip?: string;
};

export type SingleAndMultipleSelectRow = {
  id: string;
  rowName: string;
  rowImage?: string;
  tooltip?: string;
};

export type SingleAndMultipleSelectOption = {
  id: string;
  text: string;
  image: string | null;
  score: number | null;
  tooltip: string | null;
};

export type SingleAndMultipleSelectMatrix = {
  rowId: string;
  options: Array<{ optionId: string; score: number | null; alert: string | null }>;
};

export type SingleAndMultipleSelectRowsResponseValues = {
  rows: Array<SingleAndMultipleSelectRow>;
  options: Array<SingleAndMultipleSelectOption>;
  dataMatrix?: Array<SingleAndMultipleSelectMatrix> | null;
};

export type SliderRowsResponseValues = {
  rows: Array<SliderRowsItemResponseValues>;
};

export type TextItemResponseValues = null;
export type VideoResponseValues = null;
export type DateAndTimeRangeResponseValues = null;
export type PhotoResponseValues = null;
export type GeolocationResponseValues = null;
export type MessageResponseValues = null;

export type NumberItemResponseValues = {
  minValue: number;
  maxValue: number;
};

export type DrawingResponseValues = {
  drawingExample: string;
  drawingBackground: string;
};

export type ResponseValues =
  | TextItemResponseValues
  | SingleAndMultipleSelectItemResponseValues
  | SingleAndMultipleSelectRowsResponseValues
  | SliderRowsResponseValues
  | SliderItemResponseValues
  | AudioPlayerResponseValues
  | AudioResponseValues
  | VideoResponseValues
  | NumberItemResponseValues
  | DateAndTimeRangeResponseValues
  | DrawingResponseValues
  | PhotoResponseValues
  | GeolocationResponseValues
  | MessageResponseValues;

export type Config =
  | TextInputConfig
  | SingleAndMultipleSelectionConfig
  | SliderConfig
  | AudioAndVideoConfig
  | AudioPlayerConfig
  | SingleAndMultipleSelectionPerRowConfig
  | SliderRowsConfig
  | NumberConfig
  | DateAndTimeRangeConfig
  | DrawingConfig
  | PhotoConfig
  | GeolocationConfig
  | MessageConfig;

export type ItemAlert = {
  message: string;
  option: string;
  item: string;
  slider: string;
  min: number;
  max: number;
};

export type Item = {
  id?: string;
  key?: string;
  name: string;
  question: string | Record<string, string>;
  config: Config;
  responseType: ItemResponseType;
  responseValues: ResponseValues;
  alerts?: ItemAlert[];
};

export interface TextItem extends Item {
  responseType: ItemResponseType.Text;
  config: TextInputConfig;
  responseValues: TextItemResponseValues;
}

export interface SingleSelectItem extends Item {
  responseType: ItemResponseType.SingleSelection;
  config: SingleAndMultipleSelectionConfig;
  responseValues: SingleAndMultipleSelectItemResponseValues;
}

export interface MultiSelectItem extends Item {
  responseType: ItemResponseType.MultipleSelection;
  config: SingleAndMultipleSelectionConfig;
  responseValues: SingleAndMultipleSelectItemResponseValues;
}

export interface SliderItem extends Item {
  responseType: ItemResponseType.Slider;
  config: SliderConfig;
  responseValues: SliderItemResponseValues;
}

export type Activity = {
  id?: string;
  key?: string;
  name: string;
  order?: number;
  description: string | Record<string, string>;
  splashScreen?: string;
  image?: string;
  showAllAtOnce?: boolean;
  isSkippable?: boolean;
  isReviewable?: boolean;
  responseIsEditable?: boolean;
  isHidden?: boolean;
  items: Item[];
  generateReport?: boolean;
  showScoreSummary?: boolean;
  scores?: ActivitySettingsScore[];
  sections?: ActivitySettingsSection[];
  subscales?: ActivitySettingsSubscale[];
  calculateTotalScore?: SubscaleTotalScore;
};

type Theme = {
  id: string;
  name: string;
  logo: string;
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  public: boolean;
};

export type ActivitySettingsScore = {
  name?: string;
};

export type ActivitySettingsSection = {
  name?: string;
};

export type ActivitySettingsSubscale = {
  id?: string;
  name: string;
  scoring: SubscaleTotalScore;
  items: string[];
};

export type SingleApplet = {
  id?: string;
  displayName: string;
  version?: string;
  description: string | Record<string, string>;
  about: string | Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
  image: string;
  watermark: string;
  themeId: string | null;
  reportServerIp?: string;
  reportPublicKey?: string;
  reportRecipients?: string[];
  reportIncludeUserId?: boolean;
  reportIncludeCaseId?: boolean;
  reportEmailBody?: string;
  retentionPeriod?: number;
  retentionType?: RetentionPeriods;
  activities: Activity[];
  activityFlows: ActivityFlow[];
  theme?: Theme;
  encryption?: Encryption;
  generateReport: boolean;
  isPublished?: boolean;
};

export type AppletSchema = {
  applet: BaseSchema<{ result: SingleApplet } | null>;
};

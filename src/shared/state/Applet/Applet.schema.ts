import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { ColorResult } from 'react-color';

import { BaseSchema } from 'shared/state/Base';
import { RetentionPeriods } from 'shared/types';
import { AppletBody, AppletId, OwnerId } from 'api';
import {
  ItemResponseType,
  SubscaleTotalScore,
  ConditionType,
  ConditionalLogicMatch,
  CalculationType,
} from 'shared/consts';
import { Encryption } from 'shared/utils';
import { CorrectPress } from 'modules/Builder/types';

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

export type SingleAndMultiplePerRowConfig = {
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

export type FlankerButtonSetting = {
  name: string | null;
  image: string | null;
};

export type FlankerFixationSettings = {
  image: string;
  duration: number;
};

type FlankerStimulusId = string;

export type FlankerStimulusSettings = {
  id: FlankerStimulusId;
  image: string;
  correctPress: CorrectPress;
};

export type FlankerBlockSettings = {
  order: Array<FlankerStimulusId>;
  name: string;
};

type FlankerPracticeSettings = {
  instruction: string;
  blocks: Array<FlankerBlockSettings>;
  stimulusDuration: number;
  threshold: number;
  randomizeOrder: boolean;
  showFeedback: boolean;
  showSummary: boolean;
};

type FlankerTestSettings = {
  instruction: string;
  blocks: Array<FlankerBlockSettings>;
  stimulusDuration: number;
  randomizeOrder: boolean;
  showFeedback: boolean;
  showSummary: boolean;
};

type FlankerGeneralSettings = {
  instruction: string;
  buttons: Array<FlankerButtonSetting>;
  fixation: FlankerFixationSettings | null;
  stimulusTrials: Array<FlankerStimulusSettings>;
};

type FlankerConfig = {
  general: FlankerGeneralSettings;
  practice: FlankerPracticeSettings;
  test: FlankerTestSettings;
  skippableItem?: boolean;
  removeBackButton?: boolean;
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
  alerts?: ItemAlert[];
};

export type SliderRowsItemResponseValues = SliderItemResponseValues & { id: string; label: string };

export type SingleAndMultipleSelectionOption = {
  id: string;
  text: string;
  image?: string;
  score?: number;
  tooltip?: string;
  color?: string | ColorResult;
  isHidden?: boolean;
  alert?: string;
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
  options: Array<{ optionId: string; score: number | null; alert: ItemAlert['alert'] }>;
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

export type GyroscopeGeneralSettings = {
  instruction: string;
  numberOfTrials: number;
  lengthOfTest: number;
  lambdaSlope: number;
};

export type GyroscopePracticeSettings = {
  instruction: string;
};

export type GyroscopeTestSettings = {
  instruction: string;
};

export type GyroscopeConfig = {
  general: GyroscopeGeneralSettings;
  practice: GyroscopePracticeSettings;
  test: GyroscopeTestSettings;
  skippableItem?: boolean;
  removeBackButton?: boolean;
};

type TouchConfig = GyroscopeConfig;

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
  | SingleAndMultiplePerRowConfig
  | SliderRowsConfig
  | NumberConfig
  | DateAndTimeRangeConfig
  | DrawingConfig
  | PhotoConfig
  | GeolocationConfig
  | MessageConfig
  | GyroscopeConfig
  | TouchConfig
  | FlankerConfig;

export type ItemAlert = {
  key?: string;
  value?: number | string;
  minValue?: number | null;
  maxValue?: number | null;
  rowId?: string | null;
  optionId?: string | null;
  sliderId?: string | null;
  alert?: string;
};

export type BaseCondition = {
  //for frontend purposes only
  key?: string;
  itemName: string;
  type: ConditionType | '';
};

export type OptionCondition = BaseCondition & {
  payload: {
    optionId: string;
  };
};

export type SingleValueCondition = BaseCondition & {
  payload: {
    value: number;
  };
};

export type RangeValueCondition = BaseCondition & {
  payload: {
    minValue: number;
    maxValue: number;
  };
};

export type Condition = OptionCondition | SingleValueCondition | RangeValueCondition;

export type ConditionalLogic = {
  match: ConditionalLogicMatch;
  //for frontend purposes only
  key?: string;
  //TODO: for frontend purposes only - should be reviewed after refactoring phase
  itemKey?: string;
  conditions: Array<Condition>;
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
  conditionalLogic?: ConditionalLogic;
  allowEdit: boolean;
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

export type ScoresAndReports = {
  generateReport: boolean;
  showScoreSummary: boolean;
  scores: ActivitySettingsScore[];
  sections: ActivitySettingsSection[];
};

export type SubscaleSetting = {
  calculateTotalScore?: SubscaleTotalScore | null;
  subscales?: ActivitySettingsSubscale[];
  totalScoresTableData?: Record<string, string>[] | null;
};

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
  scoresAndReports?: ScoresAndReports;
  subscaleSetting?: SubscaleSetting | null;
  //TODO: for frontend purposes only - should be reviewed after refactoring phase
  conditionalLogic?: ConditionalLogic[];
  isPerformanceTask?: boolean;
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
  id: string;
  name: string;
  calculationType: CalculationType;
  showMessage: boolean;
  printItems: boolean;
  itemsScore: string[];
  itemsPrint?: string[];
  message?: string;
  minScore: number;
  maxScore: number;
};

export type ActivitySettingsSection = {
  id?: string;
  name: string;
  showMessage: boolean;
  printItems: boolean;
  itemsPrint?: string[];
  message?: string;
};

export type ActivitySettingsSubscale = {
  id?: string;
  name: string;
  scoring: SubscaleTotalScore;
  items: string[];
  subscaleTableData?: Record<string, string>[] | null;
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
  retentionPeriod?: number | null;
  retentionType?: RetentionPeriods | null;
  activities: Activity[];
  activityFlows: ActivityFlow[];
  theme?: Theme;
  pinnedAt?: string | null;
  role?: string;
  encryption?: Encryption;
  generateReport: boolean;
  isPublished?: boolean;
};

export type AppletSchema = {
  applet: BaseSchema<{ result: SingleApplet } | null>;
};

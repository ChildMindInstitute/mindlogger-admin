import { ColorResult } from 'react-color';

import { BaseSchema } from 'shared/state/Base';
import { ElementType, RetentionPeriods } from 'shared/types';
import {
  ItemResponseType,
  SubscaleTotalScore,
  ConditionType,
  ScoreConditionType,
  ConditionalLogicMatch,
  CalculationType,
  PerfTaskType,
  GyroscopeOrTouch,
  ScoreReportType,
} from 'shared/consts';
import { Encryption } from 'shared/utils';
import {
  CorrectPress,
  RoundTypeEnum,
  FlankerSamplingMethod,
  DeviceType,
  OrderName,
} from 'modules/Builder/types';

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
  createdAt?: string;
  reportIncludedItemName?: string;
  reportIncludedActivityName?: string;
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
  timer: number | null;
};

export type SliderRowsConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  addScores: boolean;
  setAlerts: boolean;
  timer: number;
};

type FlankerStimulusId = string;

export type FlankerStimulusSettings = {
  id: FlankerStimulusId;
  image: string;
  text: string;
  value: CorrectPress;
  weight?: number | null;
};

export type FlankerBlockSettings = {
  name: string;
  order: Array<FlankerStimulusId>;
};

export type FlankerButtonSetting = {
  text: string | null;
  image: string | null;
  value: CorrectPress;
};

export type FlankerConfig = {
  stimulusTrials: Array<FlankerStimulusSettings>;
  blocks: Array<FlankerBlockSettings>;
  buttons: Array<FlankerButtonSetting>;
  nextButton?: string;
  showFixation: boolean;
  fixationDuration: number | null;
  fixationScreen: { value?: string; image: string } | null;
  minimumAccuracy?: number; //threshold
  sampleSize: number;
  samplingMethod: FlankerSamplingMethod; //randomize order
  showFeedback: boolean;
  showResults: boolean; //show summary screen
  trialDuration: number; //stimulus duration
  isFirstPractice: boolean;
  isLastPractice: boolean;
  isLastTest: boolean;
  blockType: RoundTypeEnum;
  skippableItem?: boolean;
  removeBackButton?: boolean;
};

type ABTrailsConfig = {
  deviceType: DeviceType;
  orderName: OrderName;
  skippableItem?: boolean;
  removeBackButton?: boolean;
};

export type SliderItemResponseValues = {
  id?: string;
  minLabel: string;
  maxLabel: string;
  minValue: number | string;
  maxValue: number | string;
  minImage?: string;
  maxImage?: string;
  scores?: number[];
  alerts?: ItemAlert[];
};

export type SliderRowsItemResponseValues = SliderItemResponseValues & {
  id?: string;
  label?: string;
};

export type SingleAndMultiSelectOption = {
  id: string;
  text: string;
  image?: string;
  score?: number;
  tooltip?: string;
  color?: string | ColorResult;
  isHidden?: boolean;
  alert?: string;
  value?: number;
};

export type SingleAndMultipleSelectItemResponseValues = {
  paletteName?: string;
  options: Array<SingleAndMultiSelectOption>;
};

export type AudioPlayerResponseValues = {
  file: string;
};

export type AudioResponseValues = {
  maxDuration: number;
};

export type SingleAndMultipleSelectRow = {
  id: string;
  rowName: string;
  rowImage?: string;
  tooltip?: string;
};

export type SingleAndMultiSelectRowOption = {
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
  options: Array<SingleAndMultiSelectRowOption>;
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

export type GyroscopeConfig = {
  userInputType: GyroscopeOrTouch;
  phase: RoundTypeEnum;
  trialsNumber: number;
  durationMinutes: number;
  lambdaSlope: number;
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
  | FlankerConfig
  | ABTrailsConfig;

export type ItemAlert = {
  key?: string;
  value?: number | string;
  minValue?: number | string | null;
  maxValue?: number | string | null;
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

export type ScoreCondition = {
  key?: string;
  type: typeof ScoreConditionType | string;
  itemName: string;
  payload?: {
    value: boolean;
  };
};

export type OptionCondition = BaseCondition & {
  payload: {
    optionValue: string | number;
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

export type Condition =
  | OptionCondition
  | SingleValueCondition
  | RangeValueCondition
  | ScoreCondition;

export type ConditionalLogic = {
  match: ConditionalLogicMatch;
  //for frontend purposes only
  key?: string;
  //TODO: for frontend purposes only - should be reviewed after refactoring phase
  itemKey?: string;
  conditions: Array<Condition>;
};

export type Item<T = Config> = {
  id?: string;
  key?: string;
  name: string;
  question: Record<string, string>;
  config: T;
  responseType: ItemResponseType;
  responseValues: ResponseValues;
  alerts?: ItemAlert[];
  conditionalLogic?: ConditionalLogic;
  allowEdit: boolean;
  isHidden?: boolean;
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

export type ScoreOrSection = ScoreReport | SectionReport;

export type ScoresAndReports = {
  generateReport: boolean;
  showScoreSummary: boolean;
  reports: ScoreOrSection[];
};

export type SubscaleSetting<T = ActivitySettingsSubscaleItem> = {
  calculateTotalScore?: SubscaleTotalScore | null;
  subscales?: ActivitySettingsSubscale<T>[];
  totalScoresTableData?: Record<string, string>[] | null;
};

export type ParsedSubscale = {
  [key: string]: number | string;
};

export type ScoresObject = {
  [key: string]: number;
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
  isPerformanceTask?: boolean;
  performanceTaskType?: PerfTaskType;
  createdAt?: string;
  reportIncludedItemName?: string;
  //TODO: for frontend purposes only - should be reviewed after refactoring phase
  conditionalLogic?: ConditionalLogic[];
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

export type ScoreConditionalLogic = {
  name: string;
  id: string;
  flagScore: boolean;
  showMessage: boolean;
  message?: string;
  printItems: boolean;
  itemsPrint?: string[];
  match: ConditionalLogicMatch;
  conditions: Condition[];
};

export type ScoreReport = {
  id: string;
  name: string;
  type: ScoreReportType.Score;
  calculationType: CalculationType;
  showMessage: boolean;
  printItems: boolean;
  itemsScore: string[];
  itemsPrint?: string[];
  message?: string;
  minScore?: number;
  maxScore?: number;
  conditionalLogic?: ScoreConditionalLogic[];
};

export type SectionCondition = Condition | ScoreCondition;

export type SectionConditionalLogic = {
  name: string;
  id: string;
  match: ConditionalLogicMatch;
  conditions: SectionCondition[];
};

export type SectionReport = {
  id?: string;
  name: string;
  type: ScoreReportType.Section;
  showMessage: boolean;
  printItems: boolean;
  itemsPrint?: string[];
  message?: string;
  conditionalLogic?: SectionConditionalLogic;
};

export type ActivitySettingsSubscaleItem = {
  name: string;
  type: ElementType;
};

export type ActivitySettingsSubscale<T = ActivitySettingsSubscaleItem> = {
  id?: string;
  name: string;
  scoring: SubscaleTotalScore;
  items: T[];
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
  isPublished?: boolean;
  activityCount?: number | null;
  streamEnabled?: boolean | null;
};

export type AppletSchema = {
  applet: BaseSchema<{ result: SingleApplet } | null>;
};

export type UpdateActivityData = {
  activityId?: string;
  reportIncludedItemName?: string;
};

export type UpdateActivityFlowData = {
  flowId?: string;
  reportIncludedItemName?: string;
  reportIncludedActivityName?: string;
};

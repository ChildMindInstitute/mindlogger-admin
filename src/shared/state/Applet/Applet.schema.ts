import { ColorResult } from 'react-color';

import {
  CorrectPress,
  DeviceType,
  FlankerSamplingMethod,
  OrderName,
  RoundTypeEnum,
} from 'modules/Builder/types';
import {
  CalculationType,
  ConditionalLogicMatch,
  ConditionType,
  GyroscopeOrTouch,
  ItemResponseType,
  PerfTaskType,
  ScoreConditionType,
  ScoreReportType,
  SubscaleTotalScore,
  Integrations,
} from 'shared/consts';
import { BaseSchema } from 'shared/state/Base';
import { ElementType, RetentionPeriods } from 'shared/types';
import { Encryption } from 'shared/utils/encryption';
import { LookupTableDataItem } from 'modules/Builder/features/ActivitySettings/SubscalesConfiguration/LookupTable';

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
  activityIds?: string[];
  items?: ActivityFlowItem[];
  isHidden?: boolean;
  createdAt?: string;
  reportIncludedItemName?: string;
  reportIncludedActivityName?: string;
  autoAssign?: boolean;
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

export type ParagraphTextInputConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  maxResponseLength: number;
  responseRequired: boolean;
};

export type MultipleSelectionConfig = {
  removeBackButton: boolean;
  skippableItem: boolean;
  randomizeOptions: boolean;
  addScores: boolean;
  setAlerts: boolean;
  addTooltip: boolean;
  setPalette: boolean;
  timer: number;
  portraitLayout: boolean;
  additionalResponseOption: {
    textInputOption?: boolean;
    textInputRequired: boolean;
  };
  addTokens?: null | boolean;
};

export type SingleSelectionConfig = MultipleSelectionConfig & {
  autoAdvance: boolean;
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

export interface PhrasalTemplateConfig {
  removeBackButton: boolean;
  skippableItem: boolean;
  type: string;
}

export interface UnityConfig {
  skippableItem?: boolean;
  file: Uint8Array;
}

export type SliderItemResponseValues = {
  id?: string;
  minLabel?: string;
  maxLabel?: string;
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
  isNoneAbove?: boolean;
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
export type ParagraphTextItemResponseValues = null;
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
  proportion: {
    enabled: boolean;
  } | null;
};

export type PhrasalTemplateField =
  | { type: 'sentence'; text: string }
  | { type: 'item_response'; itemName: string; displayMode: string; itemIndex: number }
  | { type: 'line_break' };

export type PhrasalTemplateFieldType = PhrasalTemplateField['type'];

export interface PhrasalTemplateResponseValues {
  phrases: {
    image: string | null;
    fields: PhrasalTemplateField[];
  }[];
}

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
  | MessageResponseValues
  | PhrasalTemplateResponseValues;

export type Config =
  | TextInputConfig
  | ParagraphTextInputConfig
  | SingleSelectionConfig
  | MultipleSelectionConfig
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
  | ABTrailsConfig
  | PhrasalTemplateConfig
  | UnityConfig;

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
export type SingleMultiSelectionPerRowCondition<T = string> = OptionCondition & {
  payload: {
    rowIndex?: T;
  };
};

export type SliderRowsCondition<T = SingleValueCondition, K = string> = T & {
  payload: {
    rowIndex: K;
  };
};

export type SingleValueCondition<T = number> = BaseCondition & {
  payload: {
    value: T;
  };
};

export type RangeValueCondition<T = number> = BaseCondition & {
  payload: {
    minValue: T;
    maxValue: T;
  };
};

export type DateSingleValueCondition<T = string> = BaseCondition & {
  payload: {
    date: T;
  };
};

export type DateRangeValueCondition<T = string> = BaseCondition & {
  payload: {
    minDate: T;
    maxDate: T;
  };
};

export type Time = {
  hours: number;
  minutes: number;
};

export type TimeSingleValueCondition<T = string> = BaseCondition & {
  payload: {
    time: T;
  };
};

export type TimeIntervalValueCondition<T = string> = BaseCondition & {
  payload: {
    minTime: T;
    maxTime: T;
  };
};

export const enum TimeRangeConditionType {
  StartTime = 'from',
  EndTime = 'to',
}

export type TimeRangeSingleValueCondition<T = string> = TimeSingleValueCondition<T> & {
  payload: {
    fieldName: TimeRangeConditionType;
  };
};

export type TimeRangeIntervalValueCondition<T = string> = TimeIntervalValueCondition<T> & {
  payload: {
    fieldName: TimeRangeConditionType;
  };
};

export type Condition =
  | OptionCondition
  | SingleValueCondition
  | RangeValueCondition
  | DateSingleValueCondition
  | DateSingleValueCondition<Date>
  | DateRangeValueCondition
  | TimeSingleValueCondition
  | TimeSingleValueCondition<Time>
  | TimeIntervalValueCondition
  | TimeIntervalValueCondition<Time>
  | TimeRangeSingleValueCondition
  | TimeRangeSingleValueCondition<Time>
  | TimeRangeIntervalValueCondition
  | TimeRangeIntervalValueCondition<Time>
  | SingleMultiSelectionPerRowCondition
  | SliderRowsCondition
  | SliderRowsCondition<RangeValueCondition>
  | ScoreCondition;

export type ConditionalLogic = {
  match: ConditionalLogicMatch;
  //for frontend purposes only
  key?: string;
  itemKey?: string;
  conditions: Condition[];
};

export type Item<T = ItemCommonType> =
  | TextItem<T>
  | ParagraphTextItem<T>
  | SingleSelectItem<T>
  | MultiSelectItem<T>
  | SliderItem<T>
  | DateItem<T>
  | TimeRangeItem<T>
  | TimeItem<T>
  | GeolocationItem<T>
  | AudioItem<T>
  | AudioPlayerItem<T>
  | ABTrailsItem<T>
  | DrawingItem<T>
  | FlankerItem<T>
  | MessageItem<T>
  | SingleSelectionPerRowItem<T>
  | MultipleSelectionPerRowItem<T>
  | NumberSelectionItem<T>
  | PhotoItem<T>
  | VideoItem<T>
  | SliderRowsItem<T>
  | StabilityTrackerItem<T>
  | TouchPracticeItem<T>
  | TouchTestItem<T>
  | UnityItem<T>
  | PhrasalTemplateItem<T>;

export type ItemCommonType = {
  id?: string;
  key?: string;
  name: string;
  question: Record<string, string>;
  alerts?: ItemAlert[];
  conditionalLogic?: ConditionalLogic;
  allowEdit?: boolean;
  isHidden?: boolean;
  order?: number;
};

export type TextItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.Text;
  config: TextInputConfig;
  responseValues: TextItemResponseValues;
};

export type ParagraphTextItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.ParagraphText;
  config: ParagraphTextInputConfig;
  responseValues: ParagraphTextItemResponseValues;
};

export type SingleSelectItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.SingleSelection;
  config: SingleSelectionConfig;
  responseValues: SingleAndMultipleSelectItemResponseValues;
};

export type MultiSelectItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.MultipleSelection;
  config: MultipleSelectionConfig;
  responseValues: SingleAndMultipleSelectItemResponseValues;
};

export type SliderItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.Slider;
  config: SliderConfig;
  responseValues: SliderItemResponseValues;
};
export type DateItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.Date;
  config: DateAndTimeRangeConfig;
  responseValues: DateAndTimeRangeResponseValues;
};

export type TimeRangeItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.TimeRange;
  config: DateAndTimeRangeConfig;
  responseValues: DateAndTimeRangeResponseValues;
};

export type TimeItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.Time;
  config: DateAndTimeRangeConfig;
  responseValues: null;
};

export type GeolocationItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.Geolocation;
  config: GeolocationConfig;
  responseValues: GeolocationResponseValues;
};

export type AudioItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.Audio;
  config: AudioAndVideoConfig;
  responseValues: AudioResponseValues;
};

export type AudioPlayerItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.AudioPlayer;
  config: AudioPlayerConfig;
  responseValues: AudioPlayerResponseValues;
};

export type ABTrailsItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.ABTrails;
  config: ABTrailsConfig;
  responseValues: null;
};

export type DrawingItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.Drawing;
  config: DrawingConfig;
  responseValues: DrawingResponseValues;
};

export type FlankerItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.Flanker;
  config: FlankerConfig;
  responseValues: null;
};

export type MessageItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.Message;
  config: MessageConfig;
  responseValues: MessageResponseValues;
};

export type SingleSelectionPerRowItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.SingleSelectionPerRow;
  config: SingleAndMultiplePerRowConfig;
  responseValues: SingleAndMultipleSelectRowsResponseValues;
};

export type MultipleSelectionPerRowItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.MultipleSelectionPerRow;
  config: SingleAndMultiplePerRowConfig;
  responseValues: SingleAndMultipleSelectRowsResponseValues;
};

export type NumberSelectionItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.NumberSelection;
  config: NumberConfig;
  responseValues: NumberItemResponseValues;
};

export type PhotoItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.Photo;
  config: PhotoConfig;
  responseValues: PhotoResponseValues;
};

export type VideoItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.Video;
  config: AudioAndVideoConfig;
  responseValues: VideoResponseValues;
};

export type SliderRowsItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.SliderRows;
  config: SliderRowsConfig;
  responseValues: SliderRowsResponseValues;
};

export type StabilityTrackerItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.StabilityTracker;
  config: GyroscopeConfig;
  responseValues: null;
};

export type TouchPracticeItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.TouchPractice;
  config: TouchConfig;
  responseValues: null;
};

export type TouchTestItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.TouchTest;
  config: TouchConfig;
  responseValues: null;
};

export type PhrasalTemplateItem<T = ItemCommonType> = T & {
  config: PhrasalTemplateConfig;
  responseType: ItemResponseType.PhrasalTemplate;
  responseValues: null;
};

export type UnityItem<T = ItemCommonType> = T & {
  responseType: ItemResponseType.Unity;
  config: UnityConfig;
  responseValues: null;
};

export type ScoreOrSection = ScoreReport | SectionReport;

export type ScoresAndReports = {
  generateReport: boolean;
  showScoreSummary: boolean;
  reports: ScoreOrSection[];
};

export type AgeFieldType = 'text' | 'dropdown';

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
  performanceTaskType?: PerfTaskType | null;
  createdAt?: string;
  reportIncludedItemName?: string;
  autoAssign?: boolean;
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

export const ScoreReportScoringType = ['score', 'rawScore'] as const;

export type ScoreReportScoringType = (typeof ScoreReportScoringType)[number];

export type ScoreReport = {
  id: string;
  key: string;
  name: string;
  type: ScoreReportType.Score;
  /** Whether to show raw score or T scores in the report */
  scoringType: ScoreReportScoringType;
  calculationType: CalculationType;
  showMessage: boolean;
  printItems: boolean;
  itemsScore: string[];

  /** The name of a subscale to use for a lookup table, if `scoringType` is set to "score" */
  linkedSubscaleName?: string;
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
  id: string;
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
  allowEdit?: boolean;
};

export type ActivitySettingsSubscale<T = ActivitySettingsSubscaleItem> = {
  id?: string;
  name: string;
  scoring: SubscaleTotalScore;
  items: T[];
  subscaleTableData?: LookupTableDataItem[] | null;
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
  streamEnabled: boolean | null;
  streamIpAddress: string | null;
  streamPort: number | null;
  integrations?: Integrations[];
};

export type RespondentMeta = {
  nickname: string;
};

export type AppletMeta = {
  hasAssessment: boolean;
};

export type AppletSchema = {
  applet: BaseSchema<{
    result: SingleApplet;
    respondentMeta?: RespondentMeta;
    appletMeta?: AppletMeta;
  } | null>;
};

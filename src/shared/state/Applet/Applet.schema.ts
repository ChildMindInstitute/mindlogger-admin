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
  ConditionType,
  ConditionalLogicMatch,
  GyroscopeOrTouch,
  ItemResponseType,
  PerfTaskType,
  ScoreConditionType,
  ScoreReportType,
  SubscaleTotalScore,
} from 'shared/consts';
import { BaseSchema } from 'shared/state/Base';
import { ElementType, RetentionPeriods } from 'shared/types';
import { Encryption } from 'shared/utils/encryption';

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
export type SingleMultiSelectionPerRowCondition = BaseCondition &
  OptionCondition & {
    payload: {
      rowIndex: number;
    };
  };

export type SliderRowsCondition<T = SingleValueCondition> = BaseCondition &
  T & {
    payload: {
      rowIndex: number;
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

export const enum TimeRangeConditionType {
  StartTime = 'startTime',
  EndTime = 'endTime',
}
export type TimeRangeValueCondition = BaseCondition &
  RangeValueCondition<Date> & {
    payload: {
      type: TimeRangeConditionType;
    };
  };

export type Condition =
  | OptionCondition
  | SingleValueCondition
  | RangeValueCondition
  | TimeRangeValueCondition
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
  | TouchTestItem<T>;

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

export type PeriodicityTypeValues = {
  ONCE: 'ONCE';
  DAILY: 'DAILY';
  WEEKLY: 'WEEKLY';
  WEEKDAYS: 'WEEKDAYS';
  MONTHLY: 'MONTHLY';
  ALWAYS: 'ALWAYS';
};

export type TimerType = {
  NOT_SET: 'NOT_SET';
  TIMER: 'TIMER';
  IDLE: 'IDLE';
};

export type PeriodicityType = {
  access_before_schedule: boolean;
  end_date: string; // Format: "YYYY-MM-DD"
  end_time: string; // Format: "HH:MM:SS"
  one_time_completion: null | string;
  selected_date: null | string;
  start_date: string; // Format: "YYYY-MM-DD"
  start_time: string; // Format: "HH:MM:SS"
  timer: null | number;
  timer_type: TimerType[keyof TimerType];
  type: PeriodicityTypeValues[keyof PeriodicityTypeValues];
};

export type Activity = {
  createdAt?: string;
  description: string | Record<string, string>;
  id?: string;
  image?: string;
  isHidden?: boolean;
  isPerformanceTask?: boolean;
  isReviewable?: boolean;
  isSkippable?: boolean;
  items: Item[];
  key?: string;
  name: string;
  order?: number;
  performanceTaskType?: PerfTaskType | null;
  periodicity?: PeriodicityType;
  reportIncludedItemName?: string;
  responseIsEditable?: boolean;
  scoresAndReports?: ScoresAndReports;
  showAllAtOnce?: boolean;
  splashScreen?: string;
  subscaleSetting?: SubscaleSetting | null;
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
  key: string;
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
  streamEnabled: boolean | null;
  streamIpAddress: string | null;
  streamPort: number | null;
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

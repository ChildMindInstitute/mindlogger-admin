import {
  ABTrailsItem,
  AudioItem,
  AudioPlayerItem,
  DateItem,
  DrawingItem,
  FlankerItem,
  GeolocationItem,
  Item,
  MessageItem,
  MultipleSelectionPerRowItem,
  MultiSelectItem,
  NumberSelectionItem,
  PhotoItem,
  ScoresAndReports,
  SingleSelectionPerRowItem,
  SingleSelectItem,
  SliderItem,
  SliderRowsItem,
  StabilityTrackerItem,
  SubscaleSetting,
  TextItem,
  TimeItem,
  TimeRangeItem,
  TouchPracticeItem,
  TouchTestItem,
  VideoItem,
} from 'shared/state';
import { getJourneyCSVObject } from 'shared/utils/exportData/getJourneyCSVObject';
import { getReportCSVObject } from 'shared/utils/exportData/getReportCSVObject';
import { CorrectPress } from 'modules/Builder/types';
import { PerfTaskType } from 'shared/consts';

export type ExportActivity = {
  createdAt: string;
  description: string | Record<string, string>;
  id: string;
  idVersion: string;
  image: string;
  isAssessment?: boolean;
  isHidden?: boolean;
  isReviewable: boolean;
  isSkippable: boolean;
  items: Item[];
  name: string;
  responseIsEditable: boolean;
  scoresAndReports: ScoresAndReports | null;
  showAllAtOnce: boolean;
  splashScreen: string;
  subscaleSetting: SubscaleSetting | null;
  version: string;
  reportIncludedItemName?: string | null;
  isPerformanceTask?: boolean;
  performanceTaskType?: PerfTaskType;
};

export type MigratedAnswer = {
  id?: string;
  key?: string;
  answerItemId: string;
  fileUrl: string;
};

export type EncryptedAnswerSharedProps<A = string, E = string> = {
  userPublicKey: string;
  answer: A;
  itemIds: string[];
  items: Item[];
  events?: E;
  migratedData?: { decryptedFileAnswers?: MigratedAnswer[] };
  legacyProfileId?: string;
  migratedDate?: string | null;
};

export type ExportAnswer = {
  id: string;
  version?: string;
  activityName: string;
  subscaleSetting: SubscaleSetting | null;
  respondentId?: string;
  respondentSecretId?: string;
  activityHistoryId: string;
  flowHistoryId: null | string;
  flowName: null | string;
  createdAt: string;
  appletId: string;
  activityId: string;
  flowId: null | string;
  reviewedAnswerId: null | string;
  reviewedFlowSubmissionId: string | null;
  scheduledDatetime: string | number | null;
  startDatetime: string | number;
  endDatetime: string | number;
  client?: null | {
    appId: string;
    appVersion: string;
    width: number;
    height: number;
  };
  scheduledEventId?: null | string;
  tzOffset?: null | number;
  submitId: string;
};

export type ExtendedExportAnswer<A = string, E = string> = ExportAnswer &
  EncryptedAnswerSharedProps<A, E>;

export type EncryptionAnswerDataTypes =
  | 'userPublicKey'
  | 'itemIds'
  | 'answer'
  | 'events'
  | 'migratedData';

export type DecryptedAnswerData<
  T = ExtendedExportAnswerWithoutEncryption,
  P = ActivityItemAnswer,
> = Omit<T, EncryptionAnswerDataTypes> & P;

export type ExtendedExportAnswerWithoutEncryption = Omit<
  ExtendedExportAnswer<AnswerDTO, EventDTO>,
  EncryptionAnswerDataTypes
>;

export type DecryptedActivityData<T, P = ActivityItemAnswer> = {
  decryptedAnswers: DecryptedAnswerData<T, P>[];
  decryptedEvents: EventDTO[];
};

export type ExportCsvData = {
  name: string;
  data: string;
};

export type AdditionalTextType = { text?: string | null };

export type AdditionalEdited = { edited?: number | null };

export type DecryptedTextAnswer = string;

export type DecryptedMultiSelectionAnswer = AdditionalTextType & {
  value: (number | string)[]; // an array of selected option indexes
};

export type DecryptedSingleSelectionAnswer = AdditionalTextType & {
  value: number | string; // selected option index
};

export type DecryptedSliderAnswer = AdditionalTextType & {
  value: number;
};

export type DecryptedNumberSelectionAnswer = AdditionalTextType & {
  value: number;
};

type CachedMediaValue = {
  uri: string;
  fileName: string;
  size: number;
  type: string;
  fromLibrary: boolean;
};

export type DecryptedMediaAnswer = AdditionalTextType & {
  value: string | CachedMediaValue;
};

export type DecryptedDateRangeAnswer = AdditionalTextType & {
  value: {
    from: null | {
      hour: number;
      minute: number;
    };
    to: null | {
      hour: number;
      minute: number;
    };
  };
};

export type DecryptedDateAnswer = AdditionalTextType & {
  value: {
    year: number;
    month: number;
    day: number;
  };
};

export type DecryptedTimeAnswer = AdditionalTextType & {
  value?: {
    hours: number;
    minutes: number;
  };
  hour?: number;
  minute?: number;
};

export type DecryptedGeolocationAnswer = AdditionalTextType & {
  value: {
    latitude: number;
    longitude: number;
  };
};

type Point = {
  x: number;
  y: number;
};

type DrawPoint = {
  time: number;
} & Point;

type DrawLine = {
  points: DrawPoint[];
  startTime: number;
};

export type DecryptedDrawingValue = {
  lines: DrawLine[];
  svgString: string;
  width: number;
  uri: string;
  type: string;
  fileName: string;
};

export type DecryptedDrawingAnswer = AdditionalTextType & {
  value: DecryptedDrawingValue;
};

type ABTrailsPoint = {
  time: number;
  valid: boolean;
  start: string;
  end: string;
  actual?: string;
} & Point;

type ABTrailsLine = {
  points: ABTrailsPoint[];
};

export type DecryptedABTrailsValue = {
  lines: ABTrailsLine[];
  width: number;
  currentIndex: number;
  maximumIndex?: number;
  startTime: number;
  updated: boolean;
};

export type DecryptedABTrailsAnswer = {
  value: DecryptedABTrailsValue;
  text?: string | null;
};

export type DecryptedSingleSelectionPerRowAnswer = {
  value: string[];
};

export type DecryptedMultiSelectionPerRowAnswer = {
  value: string[][];
};

export type DecryptedSliderRowsAnswer = {
  value: number[];
};

export type DecryptedStabilityTrackerCalcValue = {
  lambda: number;
  lambdaSlope: number;
  score: number;
  stimPos: number[];
  targetPos: number[];
  timestamp: number;
  userPos: number[];
};

export const enum StabilityTrackerPhaseType {
  Focus = 'focus-phase',
  Challenge = 'challenge-phase',
}

export type DecryptedStabilityTrackerAnswerObject = {
  maxLambda: number;
  phaseType: StabilityTrackerPhaseType;
  value: DecryptedStabilityTrackerCalcValue[];
};
export type DecryptedStabilityTrackerAnswer =
  | AnswerWithWrapper<DecryptedStabilityTrackerAnswerObject>
  | DecryptedStabilityTrackerAnswerObject;

export const enum FlankerTag {
  Response = 'response',
  Trial = 'trial',
  Fixation = 'fixation',
  Feedback = 'feedback',
}

export type DecryptedFlankerAnswerItemValue = {
  button_pressed?: CorrectPress;
  correct?: boolean;
  duration: number;
  offset: number;
  question: string;
  response_touch_timestamp: number;
  start_time: number;
  start_timestamp: number;
  tag: FlankerTag;
  trial_index: number;
};

export type DecryptedFlankerAnswer =
  | AnswerWithWrapper<DecryptedFlankerAnswerItemValue[]>
  | DecryptedFlankerAnswerItemValue[];

export type AnswerWithWrapper<T> = {
  value: T;
};

export type AnswerDTO =
  | null
  | DecryptedTextAnswer
  | DecryptedMultiSelectionAnswer
  | DecryptedSingleSelectionAnswer
  | DecryptedSliderAnswer
  | DecryptedNumberSelectionAnswer
  | DecryptedDateRangeAnswer
  | DecryptedDateAnswer
  | DecryptedTimeAnswer
  | DecryptedMediaAnswer
  | DecryptedGeolocationAnswer
  | DecryptedDrawingAnswer
  | DecryptedSingleSelectionPerRowAnswer
  | DecryptedMultiSelectionPerRowAnswer
  | DecryptedSliderRowsAnswer
  | DecryptedABTrailsAnswer
  | DecryptedStabilityTrackerAnswer
  | DecryptedFlankerAnswer;

export type AnswerValue =
  | null
  | string
  | DecryptedMultiSelectionAnswer['value']
  | DecryptedSingleSelectionAnswer['value']
  | DecryptedSliderAnswer['value']
  | DecryptedNumberSelectionAnswer['value']
  | DecryptedDateRangeAnswer['value']
  | DecryptedDateAnswer['value']
  | DecryptedTimeAnswer['value']
  | DecryptedMediaAnswer['value']
  | DecryptedGeolocationAnswer['value']
  | DecryptedDrawingAnswer['value']
  | DecryptedSingleSelectionPerRowAnswer['value']
  | DecryptedMultiSelectionPerRowAnswer['value']
  | DecryptedSliderRowsAnswer['value']
  | DecryptedABTrailsAnswer['value']
  | DecryptedStabilityTrackerAnswerObject
  | DecryptedFlankerAnswerItemValue[];

export const enum UserActionType {
  SetAnswer = 'SET_ANSWER',
  Prev = 'PREV',
  Next = 'NEXT',
  Done = 'DONE',
  Undo = 'UNDO',
  Skip = 'SKIP',
  SkipPopupConfirm = 'SKIP_POPUP_CONFIRM',
  SkipPopupCancel = 'SKIP_POPUP_CANCEL',
}

export type FailedDecryption = {
  screen: '';
  time: '';
  type: unknown;
};

export type SuccessedEventDTO = {
  response?: AnswerDTO; // optional field. Required if the type is "SET_ANSWER". AnswerDTO depends on activity item type.
  screen: string; // {activityId}/{activityItemId}
  time: number; // timestamp in milliseconds
  type: UserActionType;
};

export type EventDTO = SuccessedEventDTO | FailedDecryption;

export type ExtendedEvent = SuccessedEventDTO & DecryptedAnswerData;

export type ActivityItemAnswer =
  | TextItemAnswer
  | MultiSelectionItemAnswer
  | SingleSelectionItemAnswer
  | SliderItemAnswer
  | NumberSelectionItemAnswer
  | DateRangeItemAnswer
  | DateItemAnswer
  | TimeItemAnswer
  | AudioPlayerItemAnswer
  | AudioItemAnswer
  | PhotoItemAnswer
  | VideoItemAnswer
  | GeolocationItemAnswer
  | DrawingItemAnswer
  | SingleSelectionPerRowItemAnswer
  | MultipleSelectionPerRowItemAnswer
  | SliderRowsItemAnswer
  | ABTrailsItemAnswer
  | StabilityTrackerItemAnswer
  | FlankerItemAnswer
  | MessageItemAnswer
  | TouchPracticeItemAnswer
  | TouchTestItemAnswer;

type ActivityItemAnswerCommonType = {
  id?: string;
  'data-testid'?: string;
};

export type TextItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: TextItem;
  answer: DecryptedTextAnswer;
};
export type MultiSelectionItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: MultiSelectItem;
  answer: DecryptedMultiSelectionAnswer;
};
export type SingleSelectionItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: SingleSelectItem;
  answer: DecryptedSingleSelectionAnswer;
};
export type SliderItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: SliderItem;
  answer: DecryptedSliderAnswer;
};
export type NumberSelectionItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: NumberSelectionItem;
  answer: DecryptedNumberSelectionAnswer;
};
export type DateRangeItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: TimeRangeItem;
  answer: DecryptedDateRangeAnswer;
};
export type DateItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: DateItem;
  answer: DecryptedDateAnswer;
};
export type TimeItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: TimeItem;
  answer: DecryptedTimeAnswer;
};
export type AudioPlayerItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: AudioPlayerItem;
  answer: null;
};
export type AudioItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: AudioItem;
  answer: DecryptedMediaAnswer;
};
export type PhotoItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: PhotoItem;
  answer: DecryptedMediaAnswer;
};
export type VideoItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: VideoItem;
  answer: DecryptedMediaAnswer;
};
export type GeolocationItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: GeolocationItem;
  answer: DecryptedGeolocationAnswer;
};
export type DrawingItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: DrawingItem;
  answer: DecryptedDrawingAnswer;
};
export type SingleSelectionPerRowItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: SingleSelectionPerRowItem;
  answer: DecryptedSingleSelectionPerRowAnswer;
};
export type MultipleSelectionPerRowItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: MultipleSelectionPerRowItem;
  answer: DecryptedMultiSelectionPerRowAnswer;
};
export type SliderRowsItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: SliderRowsItem;
  answer: DecryptedSliderRowsAnswer;
};
export type ABTrailsItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: ABTrailsItem;
  answer: DecryptedABTrailsAnswer;
};
export type StabilityTrackerItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: StabilityTrackerItem;
  answer: DecryptedStabilityTrackerAnswer;
};
export type FlankerItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: FlankerItem;
  answer: DecryptedFlankerAnswer;
};
export type MessageItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: MessageItem;
  answer: null;
};
export type TouchPracticeItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: TouchPracticeItem;
  answer: null;
};
export type TouchTestItemAnswer = ActivityItemAnswerCommonType & {
  activityItem: TouchTestItem;
  answer: null;
};

export const enum ElementType {
  Item = 'item',
  Subscale = 'subscale',
}

export type JourneyCSVReturnProps = {
  id: string;
  activity_scheduled_time: string;
  activity_start_time: string;
  activity_end_time: string;
  press_next_time: string;
  press_popup_skip_time: string;
  press_popup_keep_time: string;
  press_back_time: string;
  press_undo_time: string;
  press_skip_time: string;
  press_done_time: string;
  response_option_selection_time: string;
  secret_user_id?: string;
  user_id?: string;
  activity_id: string;
  activity_flow_id: string | null;
  activity_flow_name: string | null;
  activity_name: string;
  item: string;
  item_id?: string;
  prompt: string;
  response: string;
  options: string;
  version?: string;
  legacy_user_id?: string;
  event_id?: string | null;
  timezone_offset?: number | null;
};

export type AppletExportData = {
  reportData: ReturnType<typeof getReportCSVObject>[];
  activityJourneyData: ReturnType<typeof getJourneyCSVObject>[];
  mediaData: ExportMediaData[];
  drawingItemsData: ExportCsvData[];
  stabilityTrackerItemsData: ExportCsvData[];
  abTrailsItemsData: ExportCsvData[];
  flankerItemsData: ExportCsvData[];
};

export type ExportMediaData = {
  fileName: string;
  url: string;
};

export type FlankerResponseRecord = {
  [FlankerRecordFields.BlockClock]: NumberWithDotType;
  [FlankerRecordFields.ExperimentClock]: NumberWithDotType;
  [FlankerRecordFields.TrialStartTimestamp]: NumberWithDotType;
  [FlankerRecordFields.TrialOffset]: NumberWithDotType;
  [FlankerRecordFields.BlockNumber]: number;
  [FlankerRecordFields.TrialNumber]: number;
  [FlankerRecordFields.TrialType]: string | number;
  [FlankerRecordFields.EventType]: string;
  [FlankerRecordFields.ResponseValue]: DotType | FlankerResponseValue;
  [FlankerRecordFields.ResponseAccuracy]: DotType | FlankerResponseAccuracy;
  [FlankerRecordFields.VideoDisplayRequestTimestamp]: NumberWithDotType;
  [FlankerRecordFields.ResponseTouchTimestamp]: NumberWithDotType;
  [FlankerRecordFields.ResponseTime]: NumberWithDotType;
  [FlankerRecordFields.EventStartTimestamp]: NumberWithDotType;
  [FlankerRecordFields.EventOffset]: NumberWithDotType;
  [FlankerRecordFields.FailedPractice]: DotType | string;
};

export type DotType = '.';
export type NumberWithDotType = DotType | number;

export const enum FlankerResponseValue {
  Left = 'L',
  Right = 'R',
}

export const enum FlankerResponseAccuracy {
  Correct = '1',
  Incorrect = '0',
}

export const enum FlankerRecordFields {
  ExperimentClock = 'experimentClock',
  BlockClock = 'blockClock',
  TrialStartTimestamp = 'trialStartTimestamp',
  EventStartTimestamp = 'eventStartTimestamp',
  VideoDisplayRequestTimestamp = 'videoDisplayRequestTimestamp',
  ResponseTouchTimestamp = 'responseTouchTimestamp',
  TrialOffset = 'trialOffset',
  EventOffset = 'eventOffset',
  ResponseTime = 'responseTime',
  BlockNumber = 'blockNumber',
  TrialNumber = 'trialNumber',
  TrialType = 'trialType',
  EventType = 'eventType',
  ResponseValue = 'responseValue',
  ResponseAccuracy = 'responseAccuracy',
  FailedPractice = 'failedPractice',
}

export type ExportDataResult = { activities: ExportActivity[]; answers: ExtendedExportAnswer[] };

export type ResponseValueType = AnswerDTO | undefined;

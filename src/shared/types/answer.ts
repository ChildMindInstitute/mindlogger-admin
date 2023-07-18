import { Item, ScoresAndReports, SubscaleSetting } from 'shared/state';
import { getJourneyCSVObject, getReportCSVObject } from 'shared/utils';
import { CorrectPress } from 'modules/Builder/types';
import { FlankerRecordFields } from 'shared/utils/exportData/getFlankerRecords';

export type ExportActivity = {
  createdAt: string;
  description: string | Record<string, string>;
  id: string;
  idVersion: string;
  image: string;
  isAssessment: false;
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
};

export type EncryptedAnswerSharedProps = {
  userPublicKey: string;
  answer: string;
  itemIds: string[];
  items: Item[];
  events?: string;
};

export type ExportAnswer = {
  id: string;
  version?: string;
  activityName?: string;
  subscaleSetting?: SubscaleSetting | null;
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
  scheduledDatetime?: string;
  startDatetime: string;
  endDatetime: string;
};

export type ExtendedExportAnswer = ExportAnswer & EncryptedAnswerSharedProps;

export type EncryptionAnswerDataTypes = 'userPublicKey' | 'itemIds' | 'answer' | 'events';

export type DecryptedAnswerData<T> = Omit<T, EncryptionAnswerDataTypes> & ActivityItemAnswer;

export type ExtendedExportAnswerWithoutEncryption = Omit<
  ExtendedExportAnswer,
  EncryptionAnswerDataTypes
>;

export type DecryptedActivityData<T> = {
  decryptedAnswers: DecryptedAnswerData<T>[];
  decryptedEvents: EventDTO[];
};

export type ExportCsvData = {
  name: string;
  data: string;
};

export type AdditionalTextType = { text?: string | null };

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

export type DecryptedMediaAnswer = AdditionalTextType & {
  value: string;
};

export type DecryptedDateRangeAnswer = AdditionalTextType & {
  value: {
    from: {
      hour: number;
      minute: number;
    };
    to: {
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
  value: {
    hours: number;
    minutes: number;
  };
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

export type DecryptedStabilityTrackerAnswer = {
  value: {
    maxLambda: number;
    phaseType: StabilityTrackerPhaseType;
    value: DecryptedStabilityTrackerCalcValue[];
  };
};

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

export type DecryptedFlankerAnswer = {
  value: DecryptedFlankerAnswerItemValue[];
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
  | DecryptedStabilityTrackerAnswer['value']
  | DecryptedFlankerAnswer['value'];

export const enum UserActionType {
  SetAnswer = 'SET_ANSWER',
  Prev = 'PREV',
  Next = 'NEXT',
  Done = 'DONE',
  Undo = 'UNDO',
  Skip = 'SKIP',
}

export type EventDTO = {
  response?: AnswerDTO; // optional field. Required if the type is "SET_ANSWER". AnswerDTO depends on activity item type.
  screen: string; // {activityId}/{activityItemId}
  time: number; // timestamp in milliseconds
  type: UserActionType;
};

export type ExtendedEvent<T> = EventDTO & DecryptedAnswerData<T>;

export type ActivityItemAnswer = {
  id?: string;
  activityItem: Item;
  answer: AnswerDTO;
};

export const enum ElementType {
  Item = 'item',
  Subscale = 'subscale',
}

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

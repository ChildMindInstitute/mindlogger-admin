import { Item, ScoresAndReports, SubscaleSetting } from 'shared/state';

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
  id?: string;
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
  startDatetime?: string;
  endDatetime?: string;
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

export type DecryptedTextAnswer = string;

export type DecryptedMultiSelectionAnswer = {
  value: (number | string)[]; // an array of selected option indexes
  text?: string | null;
};

export type DecryptedSingleSelectionAnswer = {
  value: number | string; // selected option index
  text?: string | null;
};

export type DecryptedSliderAnswer = {
  value: number;
  text?: string | null;
};

export type DecryptedNumberSelectionAnswer = {
  value: number;
  text?: string | null;
};

export type DecryptedMediaAnswer = {
  value: string;
  text?: string | null;
};

export type DecryptedDateRangeAnswer = {
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

export type DecryptedDateAnswer = {
  value: {
    year: number;
    month: number;
    day: number;
  };
};

export type DecryptedTimeAnswer = {
  value: {
    hours: number;
    minutes: number;
  };
};

export type DecryptedGeolocationAnswer = {
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

export type DecryptedDrawingAnswer = {
  value: DecryptedDrawingValue;
  text?: string | null;
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
  | DecryptedDrawingAnswer;

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
  | DecryptedDrawingAnswer['value'];

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

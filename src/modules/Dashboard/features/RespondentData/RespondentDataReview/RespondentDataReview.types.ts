import { Item, TextItem, SliderItem, SingleSelectItem, MultiSelectItem } from 'shared/state';
import { DecryptedAnswerData } from 'shared/types';

export type Answer = {
  createdAt: string;
  answerId: string;
};

export type Activity = {
  name: string;
  id: string;
  answerDates: Answer[];
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

export type TextItemAnswer = {
  activityItem: TextItem;
  answer: DecryptedTextAnswer;
};

export type SliderActivityItem = SliderItem & {
  edited?: boolean;
};

export type SingleSelectActivityItem = SingleSelectItem & {
  edited?: boolean;
};

export type MultiSelectActivityItem = MultiSelectItem & {
  edited?: boolean;
};

export type SliderItemAnswer = {
  activityItem: SliderActivityItem;
  answer: DecryptedSliderAnswer | null;
};

export type SingleSelectItemAnswer = {
  activityItem: SingleSelectActivityItem;
  answer: DecryptedSingleSelectionAnswer | null;
};

export type MultiSelectItemAnswer = {
  activityItem: MultiSelectActivityItem;
  answer: DecryptedMultiSelectionAnswer | null;
};

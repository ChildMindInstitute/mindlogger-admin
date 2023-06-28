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
  value: number[]; // an array of selected option indexes
  text?: string | null;
};

export type DecryptedSingleSelectionAnswer = {
  value: number; // selected option index
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

export type DecryptedSexAnswer = {
  value: string;
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
  | DecryptedSexAnswer
  | DecryptedMediaAnswer;

export type AnswerValue =
  | null
  | string
  | DecryptedMultiSelectionAnswer['value']
  | DecryptedSingleSelectionAnswer['value']
  | DecryptedSliderAnswer['value']
  | DecryptedNumberSelectionAnswer['value']
  | DecryptedDateRangeAnswer['value']
  | DecryptedDateAnswer['value']
  | DecryptedMediaAnswer['value'];

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

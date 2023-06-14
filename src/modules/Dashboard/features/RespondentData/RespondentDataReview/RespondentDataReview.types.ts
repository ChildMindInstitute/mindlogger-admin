import { Item, TextItem, SliderItem, SingleSelectItem, MultiSelectItem } from 'shared/state';

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

export type AnswerDTO =
  | null
  | DecryptedTextAnswer
  | DecryptedMultiSelectionAnswer
  | DecryptedSingleSelectionAnswer
  | DecryptedSliderAnswer
  | DecryptedNumberSelectionAnswer
  | DecryptedDateRangeAnswer
  | DecryptedDateAnswer;

export type AnswerValue =
  | null
  | string
  | DecryptedMultiSelectionAnswer['value']
  | DecryptedSingleSelectionAnswer['value']
  | DecryptedSliderAnswer['value']
  | DecryptedNumberSelectionAnswer['value']
  | DecryptedDateRangeAnswer['value']
  | DecryptedDateAnswer['value'];

export const enum UserActionType {
  SetAnswer = 'SET_ANSWER',
  Prev = 'PREV',
  Next = 'NEXT',
  Done = 'DONE',
  Undo = 'UNDO',
}

export type EventDTO = {
  response?: AnswerDTO; // optional field. Required if the type is "SET_ANSWER". AnswerDTO depends on activity item type.
  screen: string; // {activityId}/{activityItemId}
  time: number; // timestamp in milliseconds
  type: UserActionType;
};

export type ActivityItemAnswer = {
  activityItem: Item;
  answer: AnswerDTO;
};

export interface TextItemAnswer {
  activityItem: TextItem;
  answer: DecryptedTextAnswer;
}

export type SliderActivityItem = SliderItem & {
  edited?: boolean;
};

export type SingleSelectActivityItem = SingleSelectItem & {
  edited?: boolean;
};

export type MultiSelectActivityItem = MultiSelectItem & {
  edited?: boolean;
};

export interface SliderItemAnswer {
  activityItem: SliderActivityItem;
  answer: DecryptedSliderAnswer | null;
}

export interface SingleSelectItemAnswer {
  activityItem: SingleSelectActivityItem;
  answer: DecryptedSingleSelectionAnswer | null;
}

export interface MultiSelectItemAnswer extends ActivityItemAnswer {
  activityItem: MultiSelectActivityItem;
  answer: DecryptedMultiSelectionAnswer | null;
}

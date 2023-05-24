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

export type ItemAnswer = {
  value: number | string | (string | number)[];
  text?: string;
};

export type SliderAnswer = ItemAnswer & {
  value: number;
};

export type MultiSelectAnswer = ItemAnswer & {
  value: string[];
};

export type SingleSelectAnswer = ItemAnswer & {
  value: string;
};

export type ActivityItemAnswer = {
  activityItem: Item;
  answer: ItemAnswer | null | string;
};

export interface TextItemAnswer extends ActivityItemAnswer {
  activityItem: TextItem;
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

export interface SliderItemAnswer extends ActivityItemAnswer {
  activityItem: SliderActivityItem;
  answer: SliderAnswer | null;
}

export interface SingleSelectItemAnswer extends ActivityItemAnswer {
  activityItem: SingleSelectActivityItem;
  answer: SingleSelectAnswer | null;
}

export interface MultiSelectItemAnswer extends ActivityItemAnswer {
  activityItem: MultiSelectActivityItem;
  answer: MultiSelectAnswer | null;
}

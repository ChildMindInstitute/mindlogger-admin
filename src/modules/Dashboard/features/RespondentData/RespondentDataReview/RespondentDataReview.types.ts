import { Item, TextItem, SliderItem, SingleSelectItem, MultiSelectItem } from 'shared/state';

export type Answer = {
  createdAt: string;
  answerId: string;
};

export type Activity = {
  name: string;
  id: string;
  answers: Answer[];
};

export type ItemAnswer = {
  value: string | string[];
  additionalText: string;
};

export type ActivityItemAnswer = {
  activityItem: Item;
  answer: ItemAnswer;
};

export interface TextItemAnswer extends ActivityItemAnswer {
  activityItem: TextItem;
}

export interface SliderItemAnswer extends ActivityItemAnswer {
  activityItem: SliderItem;
}

export interface SingleSelectItemAnswer extends ActivityItemAnswer {
  activityItem: SingleSelectItem;
}

export interface MultiSelectItemAnswer extends ActivityItemAnswer {
  activityItem: MultiSelectItem;
}

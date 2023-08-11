import { Dispatch, SetStateAction } from 'react';
import { TextItem, SliderItem, SingleSelectItem, MultiSelectItem } from 'shared/state';
import {
  ActivityItemAnswer,
  DecryptedMultiSelectionAnswer,
  DecryptedSingleSelectionAnswer,
  DecryptedSliderAnswer,
  DecryptedTextAnswer,
} from 'shared/types';

export type Answer = {
  createdAt: string;
  answerId: string;
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

export type RespondentDataReviewContextType = {
  assessment?: ActivityItemAnswer[];
  itemIds: string[];
  setItemIds: Dispatch<SetStateAction<string[]>>;
};

import { Dispatch, SetStateAction } from 'react';
import { TextItem, SliderItem, SingleSelectItem, MultiSelectItem, Item } from 'shared/state';
import {
  DecryptedAnswerData,
  DecryptedMultiSelectionAnswer,
  DecryptedSingleSelectionAnswer,
  DecryptedSliderAnswer,
  DecryptedTextAnswer,
  MultiSelectionItemAnswer,
  SingleSelectionItemAnswer,
} from 'shared/types';

import { Review } from './Feedback/FeedbackReviewed/FeedbackReviewed.types';

export type Answer = {
  createdAt: string;
  answerId: string;
};

export type TextItemAnswer = {
  activityItem: TextItem;
  answer: DecryptedTextAnswer;
  'data-testid'?: string;
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
  'data-testid'?: string;
};

export type SingleSelectItemAnswer = {
  activityItem: SingleSelectActivityItem;
  answer: DecryptedSingleSelectionAnswer | null;
  'data-testid'?: string;
};

export type MultiSelectItemAnswer = {
  activityItem: MultiSelectActivityItem;
  answer: DecryptedMultiSelectionAnswer | null;
  'data-testid'?: string;
};

export type RespondentDataReviewContextType = {
  assessment?: AssessmentActivityItem[];
  itemIds: string[];
  setItemIds: Dispatch<SetStateAction<string[]>>;
  isFeedbackOpen: boolean;
};

export type AssessmentAnswer = (
  | DecryptedSingleSelectionAnswer
  | DecryptedMultiSelectionAnswer
  | DecryptedSliderAnswer
) & {
  edited?: number | null;
};

export type AssessmentActivityItem<T = Review> = DecryptedAnswerData<
  T,
  MultiSelectionItemAnswer | SingleSelectionItemAnswer | SliderItemAnswer
> & {
  items: Item[];
  answer: {
    edited: number | null;
  };
};

export type FormattedAssessmentAnswer = {
  answer: AssessmentAnswer;
  itemId: string;
};

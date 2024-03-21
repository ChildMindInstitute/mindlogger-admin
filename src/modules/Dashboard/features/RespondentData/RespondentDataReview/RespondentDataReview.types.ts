import { Dispatch, SetStateAction } from 'react';

import {
  TextItem,
  SliderItem,
  SingleSelectItem,
  MultiSelectItem,
  Item,
  NumberSelectionItem,
  DateItem,
  TimeRangeItem,
} from 'shared/state';
import {
  DecryptedMultiSelectionAnswer,
  DecryptedSingleSelectionAnswer,
  DecryptedSliderAnswer,
  DecryptedTextAnswer,
  DecryptedNumberSelectionAnswer,
  DecryptedDateAnswer,
  DecryptedDateRangeAnswer,
} from 'shared/types';

export type Answer = {
  createdAt: string;
  answerId: string;
};

export type TextItemAnswer = {
  activityItem: TextItem;
  answer: DecryptedTextAnswer;
  'data-testid'?: string;
};

export type NumberSelectionItemAnswer = {
  activityItem: NumberSelectionItem;
  answer: DecryptedNumberSelectionAnswer;
  'data-testid'?: string;
};

export type DateItemAnswer = {
  activityItem: DateItem;
  answer: DecryptedDateAnswer;
  'data-testid'?: string;
};

export type TimaRangeItemAnswer = {
  activityItem: TimeRangeItem;
  answer: DecryptedDateRangeAnswer;
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
  setAssessment: Dispatch<SetStateAction<AssessmentActivityItem[]>>;
  lastAssessment: Item[] | null;
  assessmentVersions: string[];
  isLastVersion: boolean;
  setIsLastVersion: Dispatch<SetStateAction<boolean>>;
  isBannerVisible: boolean;
  setIsBannerVisible: Dispatch<SetStateAction<boolean>>;
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

type AssessmentItems = MultiSelectItem | SingleSelectItem | SliderItem;

type AssessmentAnswers =
  | DecryptedMultiSelectionAnswer
  | DecryptedSingleSelectionAnswer
  | DecryptedSliderAnswer;

export type AssessmentActivityItem = {
  activityItem: AssessmentItems;
  answer?: AssessmentAnswers & {
    edited?: number | null;
  };
  items: AssessmentItems[];
};

export type FormattedAssessmentAnswer = {
  answer: AssessmentAnswer;
  itemId: string;
};

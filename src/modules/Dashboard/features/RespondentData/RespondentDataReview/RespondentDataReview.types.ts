import { Dispatch, SetStateAction } from 'react';

import { ItemResponseType } from 'shared/consts';
import {
  TextItem,
  SliderItem,
  SingleSelectItem,
  MultiSelectItem,
  Item,
  NumberSelectionItem,
  DateItem,
  TimeRangeItem,
  MultipleSelectionPerRowItem,
  SingleAndMultiplePerRowConfig,
  SingleAndMultipleSelectRowsResponseValues,
  SliderRowsItem,
} from 'shared/state';
import {
  DecryptedMultiSelectionAnswer,
  DecryptedSingleSelectionAnswer,
  DecryptedSliderAnswer,
  DecryptedTextAnswer,
  DecryptedNumberSelectionAnswer,
  DecryptedDateAnswer,
  DecryptedDateRangeAnswer,
  DecryptedSingleSelectionPerRowAnswer,
  DecryptedMultiSelectionPerRowAnswer,
  DecryptedSliderRowsAnswer,
} from 'shared/types';
import { ActivityAnswerMeta as ActivityAnswerMetaApi } from 'modules/Dashboard/api';

export type Answer = {
  createdAt: string;
  answerId: string;
  endDateTime?: string;
};

export type CreateItemAnswer<I, A> = {
  activityItem: I;
  answer: A | null;
  'data-testid'?: string;
};

export type SingleSelectItemAnswer = CreateItemAnswer<
  SingleSelectActivityItem,
  DecryptedSingleSelectionAnswer
>;
export type MultiSelectItemAnswer = CreateItemAnswer<
  MultiSelectActivityItem,
  DecryptedMultiSelectionAnswer
>;
export type SliderItemAnswer = CreateItemAnswer<SliderActivityItem, DecryptedSliderAnswer>;
export type TextItemAnswer = CreateItemAnswer<TextItem, DecryptedTextAnswer>;
export type NumberSelectionItemAnswer = CreateItemAnswer<
  NumberSelectionItem,
  DecryptedNumberSelectionAnswer
>;
export type DateItemAnswer = CreateItemAnswer<DateItem, DecryptedDateAnswer>;
export type TimeRangeItemAnswer = CreateItemAnswer<TimeRangeItem, DecryptedDateRangeAnswer>;
export type SingleSelectPerRowItemAnswer = CreateItemAnswer<
  MultipleSelectionPerRowItem,
  DecryptedMultiSelectionPerRowAnswer
>;
export type MultiSelectPerRowItemAnswer = CreateItemAnswer<
  MultipleSelectionPerRowItem,
  DecryptedMultiSelectionPerRowAnswer
>;
export type SliderRowsItemAnswer = CreateItemAnswer<SliderRowsItem, DecryptedSliderRowsAnswer>;

export type SingleMultiSelectPerRowActivityItem = {
  responseType: ItemResponseType.SingleSelectionPerRow | ItemResponseType.MultipleSelectionPerRow;
  config: SingleAndMultiplePerRowConfig;
  responseValues: SingleAndMultipleSelectRowsResponseValues;
};

export type SingleMultiSelectPerRowItemAnswer = {
  activityItem: SingleMultiSelectPerRowActivityItem;
  answer: DecryptedSingleSelectionPerRowAnswer | DecryptedMultiSelectionPerRowAnswer | null;
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

export type ActivityAnswerMeta = Omit<ActivityAnswerMetaApi, 'identifier'> & {
  identifier: string | null;
};

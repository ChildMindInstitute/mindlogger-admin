import { DatavizEntity, ReviewCount } from 'modules/Dashboard/api';
import { AutocompleteOption } from 'shared/components/FormComponents';
import { ActivityItemAnswer } from 'shared/types';
import { SubscaleSetting } from 'shared/state';
import { ItemResponseType } from 'shared/consts';

export type TimeRangeAnswerValue = {
  from: string;
  to: string;
};

export type FormattedAnswer<T> = {
  value: T | null;
  text: string | null;
};

export type Answer<T> = {
  answer: FormattedAnswer<T>;
  date: string;
};

export type ItemOption = {
  id: string;
  text: string | number;
  value: number;
};

export type PerRowSelectionItemRow = {
  id: string;
  rowImage: string | null;
  rowName: string;
  tooltip: string | null;
};

export type SliderRowsRow = {
  id: string;
  label: string;
  maxImage: string | null;
  maxLabel: string | null;
  maxValue: number;
  minImage: string | null;
  minLabel: string | null;
  minValue: number;
};

export type PerRowSelectionItemOption = {
  id: string;
  image: string | null;
  text: string;
  tooltip: string | null;
  value?: string | number | null;
};

export type SingleMultiSelectionSliderItemResponseValues = {
  options: ItemOption[];
};

export type NumberSelectionItemResponseValues = {
  minValue: number;
  maxValue: number;
};

export type SingleMultiSelectionPerRowItemResponseValues = {
  options: PerRowSelectionItemOption[];
  rows: PerRowSelectionItemRow[];
};

export type SliderRowsItemResponseValues = {
  rows: SliderRowsRow[];
};

export type FormattedActivityItem<T> = {
  id: string;
  name: string;
  question: Record<string, string>;
  responseType: ItemResponseType;
  responseValues: T;
  responseDataIdentifier?: boolean;
  order: number;
};

export type Identifier = {
  encryptedValue: string;
  decryptedValue: string;
  lastAnswerDate: string;
};

export type ActivityCompletion = {
  decryptedAnswer: ActivityItemAnswer[];
  answerId: string;
  endDatetime: string;
  startDatetime?: string;
  version: string;
  subscaleSetting: SubscaleSetting;
  reviewCount?: ReviewCount;
};

export type SingleMultiSelectionSliderAnswer = Answer<number>;
export type DateAnswer = Answer<string>;
export type TextAnswer = Answer<string>;
export type TimeAnswer = Answer<number>;
export type NumberSelectionAnswer = Answer<number>;
export type TimeRangeAnswer = Answer<TimeRangeAnswerValue>;
export type SingleMultiSelectionPerRowAnswer = Record<string, Answer<string>[]>;
export type SliderRowsAnswer = Record<string, Answer<number>[]>;

export type CreateFormattedResponses<I, A> = {
  activityItem: FormattedActivityItem<I>;
  answers: A;
  dataTestid?: string;
};

export type SingleMultiSelectionSliderFormattedResponses = CreateFormattedResponses<
  SingleMultiSelectionSliderItemResponseValues,
  SingleMultiSelectionSliderAnswer[]
>;
export type TextFormattedResponses = CreateFormattedResponses<null, TextAnswer[]>;
export type NumberSelectionFormattedResponses = CreateFormattedResponses<
  NumberSelectionItemResponseValues,
  NumberSelectionAnswer[]
>;
export type TimeRangeFormattedResponses = CreateFormattedResponses<null, TimeRangeAnswer[]>;
export type DateFormattedResponses = CreateFormattedResponses<null, DateAnswer[]>;
export type TimeFormattedResponses = CreateFormattedResponses<null, TimeAnswer[]>;
export type SingleMultiSelectionPerRowFormattedResponses = CreateFormattedResponses<
  SingleMultiSelectionPerRowItemResponseValues,
  SingleMultiSelectionPerRowAnswer
>;
export type SliderRowsFormattedResponses = CreateFormattedResponses<
  SliderRowsItemResponseValues,
  SliderRowsAnswer
>;

export type FormattedResponses =
  | SingleMultiSelectionSliderFormattedResponses
  | TextFormattedResponses
  | NumberSelectionFormattedResponses
  | TimeRangeFormattedResponses
  | DateFormattedResponses
  | TimeFormattedResponses
  | SingleMultiSelectionPerRowFormattedResponses
  | SliderRowsFormattedResponses;

export type ActivityOrFlow = DatavizEntity & { isFlow: boolean };

export type ResponseOption = Record<string, FormattedResponses[]>;

export type FlowActivityAnswers = {
  activityId: string;
  activityName: string;
  isPerformanceTask: boolean;
  answers: ActivityCompletion[];
};

export type FlowSubmission = {
  submitId: string;
  createdAt: string;
  endDatetime: string | null;
  reviewCount?: ReviewCount;
};

export type FlowResponses = {
  activityId: string;
  activityName: string;
  isPerformanceTask: boolean;
  answers: ActivityCompletion[];
  responseOptions: ResponseOption | null;
  subscalesFrequency: number;
};

export type RespondentsDataFormValues = {
  startDate: Date;
  endDate: Date;
  moreFiltersVisible: boolean;
  startTime: string;
  endTime: string;
  filterByIdentifier?: boolean;
  identifier?: AutocompleteOption[];
  versions: AutocompleteOption[];
  responseDate: null | Date;
};

import { DatavizActivity, Version } from 'api';
import { ItemResponseType } from 'shared/consts';
import { SubscaleSetting } from 'shared/state';
import { ActivityItemAnswer } from 'shared/types';

import { Identifier } from '../RespondentDataSummary.types';

export type ReportProps = {
  activity: DatavizActivity;
  identifiers: Identifier[];
  versions: Version[];
};

export type ActivityCompletion = {
  decryptedAnswer: ActivityItemAnswer[];
  answerId: string;
  endDatetime: string;
  startDatetime: string;
  version: string;
  subscaleSetting?: SubscaleSetting;
};

export type CurrentActivityCompletionData = { answerId: string; date?: number } | null;

export type ReportContextType = {
  currentActivityCompletionData: CurrentActivityCompletionData;
  setCurrentActivityCompletionData: (value: CurrentActivityCompletionData) => void;
};

export type SimpleAnswerValue = string | number;

export type TimeRangeAnswerValue = {
  from: string;
  to: string;
};

export type RespondentAnswerValue = SimpleAnswerValue | TimeRangeAnswerValue;

export type FormattedAnswer<T = SimpleAnswerValue> = {
  value: T | null;
  text: string | null;
};

export type Answer<T = RespondentAnswerValue> = {
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

export type PerRowSelectionItemOption = {
  id: string;
  image: string | null;
  text: string;
  tooltip: string | null;
  value?: string | number | null;
};

export type NumberSelectionResponseValues = {
  minValue: number;
  maxValue: number;
};

export type ItemResponseValues = {
  options: ItemOption[] | PerRowSelectionItemOption[];
  rows?: PerRowSelectionItemRow[];
} & Partial<NumberSelectionResponseValues>;

export type FormattedActivityItem = {
  id: string;
  name: string;
  question: Record<string, string>;
  responseType: ItemResponseType;
  responseValues: ItemResponseValues;
  responseDataIdentifier?: boolean;
};

export type FormattedResponse<T = RespondentAnswerValue> = {
  activityItem: FormattedActivityItem;
  answers: Answer<T>[] | Record<string, Answer<T>[]>;
  dataTestid?: string;
};

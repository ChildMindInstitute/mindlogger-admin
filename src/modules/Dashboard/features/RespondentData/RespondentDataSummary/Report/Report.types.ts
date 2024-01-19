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

export type FormattedAnswer = {
  value: string | number | null;
  text: string | null;
};

export type Answer = {
  answer: FormattedAnswer;
  date: string;
};

export type ItemOption = {
  id: string;
  text: string | number;
  value: number;
};

export type ItemResponseValues = {
  options: ItemOption[];
};

export type FormattedActivityItem = {
  id: string;
  name: string;
  question: Record<string, string>;
  responseType: ItemResponseType;
  responseValues: ItemResponseValues;
  responseDataIdentifier?: boolean;
};

export type FormattedResponse = {
  activityItem: FormattedActivityItem;
  answers: Answer[];
  dataTestid?: string;
};

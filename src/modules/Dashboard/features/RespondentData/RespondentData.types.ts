import { DatavizActivity, Version } from 'api';
import { AutocompleteOption } from 'shared/components/FormComponents';
import { ActivityItemAnswer } from 'shared/types';
import { SubscaleSetting } from 'shared/state';
import { ItemResponseType } from 'shared/consts';

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

export type NumberSelectionResponseValues = {
  minValue: number;
  maxValue: number;
};

export type ItemResponseValues = {
  options: ItemOption[];
} & Partial<NumberSelectionResponseValues>;

export type FormattedActivityItem = {
  id: string;
  name: string;
  question: Record<string, string>;
  responseType: ItemResponseType;
  responseValues: ItemResponseValues;
  responseDataIdentifier?: boolean;
};

export type Identifier = {
  encryptedValue: string;
  decryptedValue: string;
};

export type ActivityCompletion = {
  decryptedAnswer: ActivityItemAnswer[];
  answerId: string;
  endDatetime: string;
  startDatetime: string;
  version: string;
  subscaleSetting?: SubscaleSetting;
};

export type FormattedResponse<T = RespondentAnswerValue> = {
  activityItem: FormattedActivityItem;
  answers: Answer<T>[];
  dataTestid?: string;
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
  summaryActivities: DatavizActivity[];
  selectedActivity: DatavizActivity | null;
  identifiers: Identifier[];
  apiVersions: Version[];
  answers: ActivityCompletion[];
  responseOptions: Record<string, FormattedResponse[]> | null;
  subscalesFrequency: number;
  responseDate: null | Date;
};

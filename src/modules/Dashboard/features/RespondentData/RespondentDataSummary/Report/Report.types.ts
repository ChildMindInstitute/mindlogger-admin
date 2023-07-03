import { DatavizActivity, Version } from 'api';
import { AutocompleteOption } from 'shared/components/FormComponents';
import { Item, SubscaleSetting } from 'shared/state';
import {
  ActivityItemAnswer,
  AnswerDTO,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

import { Identifier } from '../RespondentDataSummary.types';

export type ReportProps = {
  activity: DatavizActivity;
  identifiers: Identifier[];
  versions: Version[];
};

export type FilterFormValues = {
  startDateEndDate: Date[];
  moreFiltersVisisble: boolean;
  startTime: string;
  endTime: string;
  filterByIdentifier?: boolean;
  identifier?: AutocompleteOption[];
  versions: AutocompleteOption[];
};

export type Response = {
  date: Date | string;
  answerId: string;
};

export type ItemAnswer = {
  answer: AnswerDTO;
  date: Date | string;
};

export type FormattedItemAnswer = {
  value: string | number;
  date: Date | string;
};

export type ResponseOption = {
  activityItem: Item;
  answers?: ItemAnswer[];
};

export type ActivityReport = {
  responses: Response[];
  responseOptions: ResponseOption[];
};

export type ActivityResponse = {
  decryptedAnswer: ActivityItemAnswer[];
  events: string;
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

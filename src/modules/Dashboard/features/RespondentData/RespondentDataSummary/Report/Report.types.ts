import { DatavizActivity, Version } from 'api';
import { AutocompleteOption } from 'shared/components/FormComponents';
import { Item } from 'shared/state';

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
  value: number | string | string[];
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

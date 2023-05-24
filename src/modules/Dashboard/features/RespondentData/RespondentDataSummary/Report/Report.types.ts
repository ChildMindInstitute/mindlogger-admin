import { AutocompleteOption } from 'shared/components/FormComponents';
import { Item } from 'shared/state';

export type FilterFormValues = {
  startDateEndDate: Date[];
  moreFiltersVisisble: boolean;
  startTime: string;
  endTime: string;
  filterByIdentifier?: boolean;
  identifier?: AutocompleteOption[];
  versions?: AutocompleteOption[];
};

export type Response = {
  date: Date | string;
  answerId: string;
};

export type Version = {
  date: Date | string;
  version: string;
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
  versions: Version[];
  responseOptions: ResponseOption[];
};

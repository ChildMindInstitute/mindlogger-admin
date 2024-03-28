import { DatavizActivity } from 'api';
import { AutocompleteOption } from 'shared/components/FormComponents';
import { ItemResponseType } from 'shared/consts';

export type FetchAnswers = {
  activity: DatavizActivity;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  filterByIdentifier?: boolean;
  identifier?: AutocompleteOption[];
  versions?: AutocompleteOption[];
};

export type GetIdentifiersVersions = {
  activity: DatavizActivity;
};

export type GetSingleMultiSelectionPerRowAnswers = {
  responseType: ItemResponseType;
  currentAnswer: string | string[];
  date: string;
};

import { DatavizActivity } from 'api';
import { AutocompleteOption } from 'shared/components/FormComponents';

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

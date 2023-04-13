import { AutocompleteOption } from 'shared/components/FormComponents';

export type FilterValues = {
  startDateEndDate: Date[];
  moreFiltersVisisble: boolean;
  startTime: string;
  endTime: string;
  filterByIdentifier?: boolean;
  identifier?: AutocompleteOption[];
  versions?: AutocompleteOption[];
};

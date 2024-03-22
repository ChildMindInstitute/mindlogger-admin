import { Dispatch, SetStateAction } from 'react';

import { Version } from 'api';
import { AutocompleteOption } from 'shared/components/FormComponents';
import { Identifier } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type ReportFiltersProps = {
  identifiers: Identifier[];
  versions: Version[];
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export enum FiltersChangeType {
  StartDate,
  EndDate,
  Time,
  FilterByIdentifier,
  Identifiers,
  Versions,
}

export type OnFiltersChangeParams = {
  type: FiltersChangeType;
  startTime?: string;
  endTime?: string;
  filterByIdentifier?: boolean;
  identifier?: AutocompleteOption[];
  versions?: AutocompleteOption[];
};

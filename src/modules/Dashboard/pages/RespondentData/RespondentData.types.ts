import { Dispatch, SetStateAction } from 'react';

import { DatavizActivity } from 'api';
import { AutocompleteOption } from 'shared/components/FormComponents';

export type SummaryFiltersForm = {
  startDate: Date;
  endDate: Date;
  moreFiltersVisible: boolean;
  startTime: string;
  endTime: string;
  filterByIdentifier?: boolean;
  identifier?: AutocompleteOption[];
  versions: AutocompleteOption[];
};

export type RespondentDataContextType = {
  summaryActivities?: DatavizActivity[];
  setSummaryActivities: Dispatch<SetStateAction<DatavizActivity[] | undefined>>;
  selectedActivity?: DatavizActivity;
  setSelectedActivity: Dispatch<SetStateAction<DatavizActivity | undefined>>;
};

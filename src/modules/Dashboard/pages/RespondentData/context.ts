import { createContext } from 'react';

import { RespondentDataContextType } from './RespondentData.types';

export const RespondentDataContext = createContext<RespondentDataContextType>({
  summaryActivities: undefined,
  setSummaryActivities: () => null,
  selectedActivity: undefined,
  setSelectedActivity: () => null,
});

import { createContext } from 'react';

import { ReportContextType } from './Report.types';

export const ReportContext = createContext<ReportContextType>({
  currentActivityCompletionData: null,
  setCurrentActivityCompletionData: () => null,
});

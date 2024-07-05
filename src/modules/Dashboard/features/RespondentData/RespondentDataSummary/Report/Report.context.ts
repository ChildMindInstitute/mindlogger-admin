import { createContext } from 'react';

import { nullReturnFunc } from 'shared/utils';

import { ReportContextType } from './Report.types';

export const ReportContext = createContext<ReportContextType>({
  currentActivityCompletionData: null,
  setCurrentActivityCompletionData: nullReturnFunc,
});

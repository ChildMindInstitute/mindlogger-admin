import { useContext } from 'react';

import { DataSummaryContext } from './DataSummaryContext.context';

export const useDataSummaryContext = () => useContext(DataSummaryContext);

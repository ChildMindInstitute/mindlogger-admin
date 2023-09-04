import { PayloadAction } from '@reduxjs/toolkit';

import { ConfigChanges, ReportConfigSchema } from './ReportConfig.schema';

export const reducers = {
  setReportConfigChanges: (
    state: ReportConfigSchema,
    action: PayloadAction<ConfigChanges>,
  ): void => {
    state.configChanges.data = action.payload;
    state.configChanges.status = 'success';
  },
};

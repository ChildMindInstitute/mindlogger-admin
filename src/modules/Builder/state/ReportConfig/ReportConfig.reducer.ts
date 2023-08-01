import { PayloadAction } from '@reduxjs/toolkit';

import { state as initialState } from './ReportConfig.state';
import { ConfigChanges, ReportConfigSchema } from './ReportConfig.schema';

export const reducers = {
  resetReportConfigChanges: (state: ReportConfigSchema): void => {
    state.configChanges = initialState.configChanges;
  },

  setReportConfigChanges: (
    state: ReportConfigSchema,
    action: PayloadAction<ConfigChanges>,
  ): void => {
    state.configChanges.data = action.payload;
    state.configChanges.status = 'success';
  },
};

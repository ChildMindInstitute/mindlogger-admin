import { PayloadAction } from '@reduxjs/toolkit';

import { ConfigChanges, ReportConfigSchema } from './ReportConfig.schema';
import { state as initialState } from './ReportConfig.state';

export const reducers = {
  resetReportConfigChanges: (state: ReportConfigSchema) => {
    state.configChanges = initialState.configChanges;
  },
  setReportConfigChanges: (state: ReportConfigSchema, action: PayloadAction<ConfigChanges>): void => {
    state.configChanges.data = action.payload;
    state.configChanges.status = 'success';
  },
};

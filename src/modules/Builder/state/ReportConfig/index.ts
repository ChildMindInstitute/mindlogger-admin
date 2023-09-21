import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';

import { state as initialState } from './ReportConfig.state';
import { reducers } from './ReportConfig.reducer';
import { ReportConfigSchema } from './ReportConfig.schema';

export * from './ReportConfig.schema';

const slice = createSlice({
  name: 'reportConfig',
  initialState,
  reducers,
});

export const reportConfig = {
  slice,
  actions: slice.actions,
  useReportConfigChanges: (): ReportConfigSchema['configChanges']['data'] =>
    useAppSelector(
      ({
        reportConfig: {
          configChanges: { data },
        },
      }) => data,
    ),
};

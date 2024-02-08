import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store/hooks';

import { reducers, extraReducers } from './Alerts.reducer';
import { AlertsSchema } from './Alerts.schema';
import { state as initialState } from './Alerts.state';
import * as thunk from './Alerts.thunk';
export * from './Alerts.schema';

const slice = createSlice({
  name: 'alerts',
  initialState,
  reducers,
  extraReducers,
});

export const alerts = {
  thunk,
  slice,
  actions: slice.actions,
  useAlertsData: (): AlertsSchema['alerts']['data'] =>
    useAppSelector(
      ({
        alerts: {
          alerts: { data },
        },
      }) => data,
    ),
  useAlertsStatus: (): AlertsSchema['alerts']['status'] =>
    useAppSelector(
      ({
        alerts: {
          alerts: { status },
        },
      }) => status,
    ),
};

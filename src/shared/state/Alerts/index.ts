import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from 'redux/store';

import { addAlerts, updateAlert } from './Alerts.utils';
import { extraReducers } from './Alerts.reducer';
import { state as initialState } from './Alerts.state';
import * as thunk from './Alerts.thunk';
import { AlertsSchema } from './Alerts.schema';
export * from './Alerts.schema';

const slice = createSlice({
  name: 'alerts',
  initialState,
  reducers: { addAlerts, updateAlert },
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
};

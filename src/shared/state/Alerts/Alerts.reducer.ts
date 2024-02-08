import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { getFulfilledDataWithConcatenatedResult, getPendingData, getRejectedData } from 'shared/utils/state';

import { AlertsSchema } from './Alerts.schema';
import { state as initialState } from './Alerts.state';
import { getAlerts } from './Alerts.thunk';
import { addAlerts, updateAlertWatchedState } from './Alerts.utils';

export const reducers = {
  resetAlerts: (state: AlertsSchema): void => {
    state.alerts = initialState.alerts;
  },
  addAlerts,
  updateAlertWatchedState,
};

export const extraReducers = (builder: ActionReducerMapBuilder<AlertsSchema>): void => {
  getPendingData({ builder, thunk: getAlerts, key: 'alerts' });

  getFulfilledDataWithConcatenatedResult({
    builder,
    thunk: getAlerts,
    key: 'alerts',
    initialState,
  });

  getRejectedData({ builder, thunk: getAlerts, key: 'alerts', initialState });
};

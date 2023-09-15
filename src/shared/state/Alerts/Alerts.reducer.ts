import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import uniqBy from 'lodash.uniqby';

import { getPendingData, getRejectedData } from 'shared/utils';

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

  builder.addCase(getAlerts.fulfilled, ({ alerts }, { payload }) => {
    alerts.requestId = initialState.alerts.requestId;
    alerts.status = 'success';
    alerts.data = {
      notWatched: payload?.data.notWatched,
      count: payload?.data.count,
      result: uniqBy((alerts.data?.result ?? []).concat(payload?.data.result), 'id'),
    };
  });

  getRejectedData({ builder, thunk: getAlerts, key: 'alerts', initialState });
};

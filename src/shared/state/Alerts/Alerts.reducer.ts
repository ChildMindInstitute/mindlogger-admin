import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { getFulfilledData, getPendingData, getRejectedData } from 'shared/utils';

import { AlertsSchema } from './Alerts.schema';
import { state as initialState } from './Alerts.state';
import { getAlerts } from './Alerts.thunk';

export const extraReducers = (builder: ActionReducerMapBuilder<AlertsSchema>): void => {
  getPendingData({ builder, thunk: getAlerts, key: 'alerts' });
  getFulfilledData({ builder, thunk: getAlerts, key: 'alerts', initialState });
  getRejectedData({ builder, thunk: getAlerts, key: 'alerts', initialState });
};

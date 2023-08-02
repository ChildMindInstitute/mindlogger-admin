import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import uniqBy from 'lodash.uniqby';

import { getPendingData, getRejectedData } from 'shared/utils';

import { AlertsSchema } from './Alerts.schema';
import { state as initialState } from './Alerts.state';
import { getAlerts } from './Alerts.thunk';

export const extraReducers = (builder: ActionReducerMapBuilder<AlertsSchema>): void => {
  getPendingData({ builder, thunk: getAlerts, key: 'alerts' });

  builder.addCase(getAlerts.fulfilled, ({ alerts }, { payload }) => {
    alerts.requestId = initialState.alerts.requestId;
    alerts.status = 'success';
    alerts.data = {
      count: payload.data.count,
      result: uniqBy((alerts.data?.result ?? []).concat(payload.data.result), 'id'),
    };
  });

  getRejectedData({ builder, thunk: getAlerts, key: 'alerts', initialState });
};

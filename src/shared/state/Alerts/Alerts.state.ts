import { base } from 'shared/state/Base';

import { AlertsSchema } from './Alerts.schema';

const initialState = {
  ...base.state,
  data: {
    result: [],
    count: 0,
  },
};

export const state: AlertsSchema = {
  alerts: initialState,
};

import { initialStateData } from 'shared/state';

import { AlertsSchema } from './Alerts.schema';

export const state: AlertsSchema = {
  alerts: {
    ...initialStateData,
    data: {
      result: [],
      count: 0,
      notWatched: 0,
    },
  },
};

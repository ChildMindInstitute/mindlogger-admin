import { initialStateData } from '../Base';
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

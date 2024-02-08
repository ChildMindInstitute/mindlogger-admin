import { AlertsSchema, AlertType } from './Alerts.schema';

export const updateAlertWatchedState = (
  { alerts }: AlertsSchema,
  {
    payload,
  }: {
    payload: Pick<AlertType, 'id' | 'isWatched'>;
  },
): void => {
  if (!alerts.data?.result) return;

  alerts.data.notWatched += payload.isWatched ? -1 : 1;
  alerts.data.result = alerts.data.result.map(alert =>
    alert.id === payload.id
      ? {
          ...alert,
          isWatched: payload.isWatched,
        }
      : alert,
  );
};

export const addAlerts = (
  { alerts }: AlertsSchema,
  {
    payload,
  }: {
    payload: AlertType[];
  },
): void => {
  if (!alerts.data?.result) return;

  alerts.data.result = [...payload, ...alerts.data.result];
  alerts.data.count = alerts.data.count + payload.length;
  alerts.data.notWatched += payload.filter(alert => !alert.isWatched).length;
};

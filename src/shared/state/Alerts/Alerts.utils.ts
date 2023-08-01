import { AlertsSchema, AlertType } from './Alerts.schema';

export const updateAlert = (
  { alerts }: AlertsSchema,
  {
    payload,
  }: {
    payload: Pick<AlertType, 'id' | 'isWatched'>;
  },
): void => {
  if (!alerts.data?.result) return;

  alerts.data.result = alerts.data.result.map((alert) =>
    alert.id === payload.id
      ? {
          ...alert,
          isWatched: true,
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
  alerts.data.count = alerts.data.result.length + payload.length;
};

import { BaseSchema } from 'shared/state/Base';

export type AlertType = {
  id: string;
  isWatched: boolean;
  appletId: string;
  appletName: string;
  version: string;
  secretId: string;
  activityId: string;
  activityItemId: string;
  message: string;
  createdAt: string;
  answerId: string;
};

export type AlertsSchema = {
  alerts: BaseSchema<{ result: AlertType[]; count: number } | null>;
};

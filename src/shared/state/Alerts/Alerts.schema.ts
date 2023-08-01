import { BaseSchema } from 'shared/state/Base';
import { Encryption } from 'shared/utils';

export type AlertType = {
  id: string;
  isWatched: boolean;
  appletId: string;
  appletName: string;
  appletImage?: string;
  version: string;
  secretId: string;
  activityId: string;
  activityItemId: string;
  message: string;
  createdAt: string;
  answerId: string;
  respondentId?: string;
  workspaceName?: string;
  encryption?: Encryption;
};

export type AlertsSchema = {
  alerts: BaseSchema<{ result: AlertType[]; count: number } | null>;
};

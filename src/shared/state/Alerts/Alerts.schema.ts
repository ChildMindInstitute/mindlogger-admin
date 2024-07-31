import { BaseSchema } from 'shared/state/Base';
import { Encryption } from 'shared/utils/encryption';

export type AlertMessageType = 'answer' | 'integration';

export type AlertType = {
  id: string;
  isWatched: boolean;
  appletId: string;
  appletName: string;
  image: string;
  version: string;
  secretId: string;
  activityId: string;
  activityItemId: string;
  message: string;
  createdAt: string;
  answerId: string;
  subjectId: string;
  workspace: string;
  respondentId: string;
  type: AlertMessageType;
  encryption: Encryption;
};

export type AlertsSchema = {
  alerts: BaseSchema<{ result: AlertType[]; count: number; notWatched: number } | null>;
};

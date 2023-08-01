import { Encryption } from 'shared/utils';

export type WebsocketAlertType = {
  id: string;
  applet_id: string;
  applet_name: string;
  applet_image?: string;
  version: string;
  secret_id: string;
  activity_id: string;
  activity_item_id: string;
  message: string;
  created_at: string;
  answer_id: string;
  respondent_id?: string;
  workspace_name?: string;
  encryption?: Encryption;
};

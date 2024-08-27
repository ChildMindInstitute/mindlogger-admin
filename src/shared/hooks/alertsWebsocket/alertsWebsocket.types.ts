export type WebsocketAlertType = {
  id: string;
  applet_id: string;
  applet_name: string;
  image: string;
  version: string;
  secret_id: string;
  activity_id: string;
  activity_item_id: string;
  message: string;
  created_at: string;
  answer_id: string;
  subject_id: string;
  workspace: string;
  respondent_id: string;
  type: 'answer' | 'integration';
  encryption: {
    public_key: string;
    prime: string;
    base: string;
    account_id: string;
  };
};

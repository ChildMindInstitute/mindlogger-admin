import { WebsocketAlertType } from 'shared/hooks/websocket/websocket.types';
import { AlertType } from 'shared/state';
import { authStorage } from 'shared/utils';

export const getWebsocketProtocol = () => {
  const token = authStorage.getAccessToken();

  return `bearer|${token}`;
};

export const getAlertFormValue = (alertMessage: string): AlertType | null => {
  if (!alertMessage) return null;

  try {
    const alert: WebsocketAlertType = JSON.parse(alertMessage);

    return {
      isWatched: false,
      id: alert.id,
      appletId: alert.applet_id,
      appletName: alert.applet_name,
      image: alert.image,
      version: alert.version,
      secretId: alert.secret_id,
      activityId: alert.activity_id,
      activityItemId: alert.activity_item_id,
      message: alert.message,
      createdAt: alert.created_at,
      answerId: alert.answer_id,
      respondentId: alert.respondent_id,
      workspace: alert.workspace,
      encryption: alert.encryption,
    };
  } catch (error) {
    console.warn('Error while WS alert parsing!');

    return null;
  }
};

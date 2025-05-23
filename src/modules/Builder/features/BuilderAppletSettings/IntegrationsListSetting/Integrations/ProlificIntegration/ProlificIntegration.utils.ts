import { object, string } from 'yup';
import { AxiosError } from 'axios';

import { authApiClient } from 'shared/api/apiConfig';
import { IntegrationTypes } from 'shared/consts';
import {
  Mixpanel,
  MixpanelEventType,
  MixpanelProps,
  ProlificConnectClickEvent,
  ProlificConnectSuccessfulEvent,
} from 'shared/utils';

export const createProlificIntegration = async (apiToken: string, appletId?: string) => {
  try {
    await authApiClient.post('/integrations', {
      integrationType: IntegrationTypes.Prolific,
      appletId,
      configuration: {
        api_key: apiToken,
      },
    });
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 400) {
      throw new Error('Prolific integration already exists');
    } else if (e instanceof AxiosError && e.response?.status === 401) {
      throw new Error('Invalid Prolific API Token');
    }

    throw new Error('Internal Server Error');
  }
};

const ProlificIntegrationStatus = object({
  appletId: string().required(),
  integrationType: string().required(),
  configuration: object({}).required(),
});

export const prolificIntegrationExists = async (appletId: string): Promise<boolean> => {
  try {
    const response = await authApiClient.get('/integrations', {
      params: { applet_id: appletId, integration_type: IntegrationTypes.Prolific },
    });

    if (response.status === 200) {
      const prolificIntegrationStatus = await ProlificIntegrationStatus.validate(response.data);

      return prolificIntegrationStatus.appletId === appletId;
    }

    return false;
  } catch (error) {
    // When integration is not found, the API returns 400 status code
    if (error instanceof AxiosError && error.response?.status === 400) {
      return false;
    }

    throw error;
  }
};

export const deleteProlificIntegration = async (appletId: string) => {
  const response = await authApiClient.delete(`/integrations/applet/${appletId}`, {
    params: { integration_type: IntegrationTypes.Prolific },
  });

  if (response.status !== 204) {
    throw new Error('Failed to delete Prolific API Token');
  }
};

type ProlificEvent = ProlificConnectClickEvent | ProlificConnectSuccessfulEvent;
type ProlificEventType =
  | MixpanelEventType.ProlificConnectClick
  | MixpanelEventType.ProlificConnectSuccessful;

export const trackProlificEvent = (action: ProlificEventType, userId: string | null) => {
  if (!userId) return;
  const event: ProlificEvent = { action };
  event[MixpanelProps.UserId] = userId;

  Mixpanel.track(event);
};

import { object, string } from 'yup';
import { AxiosError } from 'axios';

import { authApiClient } from 'shared/api/apiConfig';
import { IntegrationTypes } from 'shared/consts';

export const createProlificIntegration = async (apiToken: string, appletId?: string) => {
  try {
    await authApiClient.post('/integrations/', {
      integrationType: IntegrationTypes.Prolific,
      appletId,
      configuration: {
        api_key: apiToken,
      },
    });
  } catch (e) {
    throw new Error('Invalid Prolific API Token');
  }
};

const ProlificIntegrationStatus = object({
  appletId: string().required(),
  integrationType: string().required(),
  configuration: object({}).required(),
});

export const prolificIntegrationExists = async (appletId: string): Promise<boolean> => {
  try {
    const response = await authApiClient.get('/integrations/', {
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

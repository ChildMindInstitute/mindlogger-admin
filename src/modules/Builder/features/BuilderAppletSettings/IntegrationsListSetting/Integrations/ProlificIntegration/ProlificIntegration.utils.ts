import { authApiClient } from 'shared/api/apiConfig';

export const saveProlificApiToken = async (apiToken: string) => {
  const response = await authApiClient.post('/users/me/prolific/token', { apiToken });
  if (response.status !== 200) {
    throw new Error('Error saving Prolific API token');
  }
};

export const getProlificApiToken = async (): Promise<string | null> => {
  const response = await authApiClient.get('/users/me/prolific/token');

  if (response.status === 200) {
    return response.data.result;
  }

  return null;
};

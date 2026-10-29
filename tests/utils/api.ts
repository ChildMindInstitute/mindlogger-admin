import {APIRequestContext, request} from '@playwright/test';
import {runtimeConfig} from "../config";

// Construct a URL for API endpoints
export const constructApiUrl = (baseUrl: string, endpoint: string): string => {
  return `${baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
};

// Generic POST request helper
export const postToApi = async (
  apiRequestContext: APIRequestContext,
  url: string,
  data: object,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'POST'
): Promise<any> => {
  const response = await apiRequestContext.fetch(url, {
    method,
    data: data ? JSON.stringify(data) : undefined,
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok()) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status()} ${response.statusText()} - ${errorText}`);
  }

  return response.json();
};

type ApiLoginResponse = {
  result: {
    token: {
      accessToken: string
      refreshToken: string
      tokenType: string
    },
    user: {
      email: string
      firstName: string
      lastName: string
      id: string
      mfaEnabled: boolean
    }
  }
}

/**
 * Perform an API authentication and return an access token on success
 * @param email
 * @param password
 */
export const performLogin = async (email: string, password: string): Promise<string> => {
  const api = await request.newContext({ baseURL: runtimeConfig.apiBaseURL });
  const res = await api.post('/auth/login', {
    data: { email: email, password: password },
  });

  if (!res.ok()) throw new Error(`Login failed: ${res.status()} ${await res.text()}`);

  const r = await res.json() as ApiLoginResponse;
  const accessToken = r.result.token.accessToken;
  await api.dispose();

  return accessToken;
}

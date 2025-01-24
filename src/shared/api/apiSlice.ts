import { BaseQueryFn, createApi, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { AxiosError, AxiosRequestConfig, Method } from 'axios';

import { authApiClient } from './apiConfig';

/**
 * Base query adapter to allow RTK Query to use existing Axios infrastruction instead of fetch.
 */
const axiosBaseQuery: BaseQueryFn<
  {
    url: string;
    method?: AxiosRequestConfig['method'];
    body?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
    headers?: AxiosRequestConfig['headers'];
  },
  unknown,
  FetchBaseQueryError
> = async ({ url: urlProp, method: methodProp, body, params, headers }) => {
  const url = urlProp.startsWith('/') ? urlProp : `/${urlProp}`;

  // Choose the axios function based on the method prop, defaulting to get
  const method = (methodProp?.toLowerCase() ?? 'get') as Lowercase<Method>;

  try {
    let promise;

    // Use appropriate axios method to preserve support for mockAxios spies in unit tests
    switch (method) {
      case 'get':
        promise = authApiClient.get(url, { params, headers });
        break;
      case 'delete':
        promise = authApiClient.delete(url, { params, headers });
        break;
      case 'head':
        promise = authApiClient.head(url, { params, headers });
        break;
      case 'options':
        promise = authApiClient.options(url, { params, headers });
        break;
      case 'post':
        promise = authApiClient.post(url, body, { params, headers });
        break;
      case 'put':
        promise = authApiClient.put(url, body, { params, headers });
        break;
      case 'patch':
        promise = authApiClient.patch(url, body, { params, headers });
        break;
      default:
        promise = authApiClient.request({ url, method, data: body, params, headers });
    }

    const returnVal = await promise;

    // TODO: Some unit tests currently mock an incorrect return type ({ payload: … }), so to
    // allow them to continue passing, we need to implement a workaround. Eventually unit tests
    // should be fixed to mock Axios calls correctly.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const innerResponse = (returnVal as any).payload?.response;
    if (innerResponse?.status >= 400) {
      const error = new Error() as AxiosError;
      error.status = innerResponse.status;
      error.response = innerResponse;
      throw error;
    }

    return {
      data: returnVal.data,
      meta: {
        response: {
          status: returnVal.status,
          headers: returnVal.headers,
        },
      },
    };
  } catch (axiosError) {
    const { response, message } = axiosError as AxiosError;

    return {
      error: {
        status: response?.status,
        data: response?.data ?? message,
      } as FetchBaseQueryError,
      meta: {
        response: {
          status: response?.status,
          headers: response?.headers,
        },
      },
    };
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Applet', 'Respondent', 'Manager'],
  endpoints: (builder) => ({}),
});

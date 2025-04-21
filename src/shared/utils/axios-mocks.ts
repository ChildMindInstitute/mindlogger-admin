import { vi } from 'vitest';
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { BaseSchema, MetaSchema } from '../state';
import { ApiResponseCodes } from '../api';

// Define HttpResponse type based on AxiosResponse
export type HttpResponse = AxiosResponse;

/**
 * Provide URL-response pairs for any HTTP GET requests performed within a test. Don't forget
 * to reset it afterward
 * @param responses A object keyed by URL and containing their respective HttpResponse values
 */
export const mockGetRequestResponses = (
  responses: Record<string, HttpResponse | ((params: Record<string, string>) => HttpResponse)>,
): void => {
  // Mock axios.get with vitest
  vi.spyOn(axios, 'get').mockImplementation(
    <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
      if (url && responses[url]) {
        const response = responses[url];

        if (typeof response === 'function' && config?.params) {
          return Promise.resolve(response(config.params) as AxiosResponse<T>);
        }

        return Promise.resolve(responses[url] as AxiosResponse<T>);
      } else {
        // Must explain that the request was unmocked via a console log statement, else you only
        // receive a contextless UnhandledPromiseRejection error.
        // eslint-disable-next-line no-console
        console.log(`No response provided for ${url}`);

        throw new Error(`No response provided for ${url}`);
      }
    },
  );
};

export type HttpResponseWithData<D> = Omit<HttpResponse, 'data'> & { data: D };

/**
 * Easily mock a successful HttpResponse by just providing the data
 * @param data
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const mockSuccessfulHttpResponse = <T extends unknown>(
  data: T,
): HttpResponseWithData<T> => ({
  status: ApiResponseCodes.SuccessfulResponse,
  statusText: 'OK',
  headers: {},
  config: {} as InternalAxiosRequestConfig,
  data,
});

/**
 * Easily mock a base schema type with status 'success' and requestId 'requestId'
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const mockSchema = <T extends unknown>(
  data: T | null = null,
  meta?: Partial<MetaSchema>,
): BaseSchema<T | null> => ({
  status: 'success',
  requestId: 'requestId',
  ...meta,
  data,
});

import mockAxios, { HttpResponse } from 'jest-mock-axios';

import { BaseSchema, MetaSchema } from '../state';
import { ApiResponseCodes } from '../api';

/**
 * Provide URL-response pairs for any HTTP GET requests performed within a test. Don't forget
 * to reset it afterward
 * @param responses A object keyed by URL and containing their respective HttpResponse values
 */
export const mockGetRequestResponses = (
  responses: Record<string, HttpResponse | ((params: Record<string, string>) => HttpResponse)>,
): void => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  mockAxios.get.mockImplementation((url: string, options?: { params: Record<string, string> }) => {
    if (url && responses[url]) {
      const response = responses[url];

      if (typeof response === 'function') {
        return Promise.resolve(response(options?.params ?? {}));
      }

      return Promise.resolve(responses[url]);
    } else {
      // Must explain that the request was unmocked via a console log statement, else you only
      // receive a contextless UnhandledPromiseRejection error.
      // eslint-disable-next-line no-console
      console.log(`No response provided for ${url}`);

      throw new Error(`No response provided for ${url}`);
    }
  });
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

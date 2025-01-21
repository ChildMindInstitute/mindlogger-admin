import mockAxios, { HttpResponse } from 'jest-mock-axios';

import { BaseSchema, MetaSchema } from '../state';
import { ApiResponseCodes, BASE_API_URL } from '../api';

/**
 * Provide URL-response pairs for any HTTP GET requests performed within a test. Don't forget
 * to reset it afterward
 *
 * @param responses Object keyed by URL mapped to respective HttpResponse or function that
 *                  receives query parameters and returns HttpResponse
 */
export const mockGetRequestResponses = (
  responses: Record<string, HttpResponse | ((params: Record<string, string>) => HttpResponse)>,
): void => {
  /* Axios support
  =================================================== */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  mockAxios.get.mockImplementation((url: string, options?: { params: Record<string, string> }) => {
    const response = responses[url];
    if (response) {
      if (typeof response === 'function') {
        return Promise.resolve(response(options?.params ?? {}));
      }

      return Promise.resolve(response);
    } else {
      // Must explain that mock request was not provided via console log statement, else you only
      // receive a contextless UnhandledPromiseRejection error.
      // eslint-disable-next-line no-console
      console.log(`No response provided for ${url}`);

      throw new Error(`No response provided for ${url}`);
    }
  });

  /* Fetch support
  =================================================== */
  fetchMock.mockIf(new RegExp(`^${BASE_API_URL}`), async (req) => {
    const url = req.url.split('?')[0].replace(BASE_API_URL ?? '', '');
    const response = responses[url];

    if (response) {
      if (typeof response === 'function') {
        // Pass the parsed request query parameters to the response function
        const responseValue = response(
          Object.fromEntries(new URLSearchParams(req.url.split('?')[1])),
        );

        return {
          body: JSON.stringify(responseValue.data),
          init: { status: responseValue.status },
        };
      }

      return {
        body: JSON.stringify(response.data),
        init: { status: response.status },
      };
    } else {
      // Must explain that mock request was not provided via console log statement, else you only
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

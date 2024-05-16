import mockAxios, { HttpResponse } from 'jest-mock-axios';

import { BaseSchema, MetaSchema } from '../state';
import { ApiResponseCodes } from '../api';

/**
 * Provide URL-response pairs for any HTTP GET requests performed within a test. Don't forget
 * to reset it afterward
 * @param responses A object keyed by URL and containing their respective HttpResponse values
 */
export const mockGetRequestResponses = (responses: Record<string, HttpResponse>): void => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  mockAxios.get.mockImplementation((url) => {
    if (url && responses[url]) {
      return Promise.resolve(responses[url]);
    } else {
      return Promise.reject(`No response provided for ${url}`);
    }
  });
};

/**
 * Easily mock a successful HttpResponse by just providing the data
 * @param data
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const mockSuccessfulHttpResponse = <T extends unknown>(data: T): HttpResponse => ({
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

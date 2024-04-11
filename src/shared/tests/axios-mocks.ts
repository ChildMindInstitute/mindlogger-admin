import mockAxios, { HttpResponse } from 'jest-mock-axios';

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

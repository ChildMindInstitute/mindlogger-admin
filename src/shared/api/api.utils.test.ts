import { shouldNotSkipRoute } from './api.utils';

describe('shouldNotSkipRoute', () => {
  const testCases = [
    {
      url: '/workspaces/3a765cdf-a67e-490f-a6df-a8984fe7aa5b/applets/c05fabd2-5952-4ebf-b157-1c5bb581e461/respondents',
      expectedResult: false,
    },
    { url: '/workspaces/3a765cdf-a67e-490f-a6df-a8984fe7aa5b/managers', expectedResult: false },
    { url: '/workspaces/3a765cdf-a67e-490f-a6df-a8984fe7aa5b/respondents', expectedResult: false },
    {
      url: '/workspaces/3a765cdf-a67e-490f-a6df-a8984fe7aa5b/applets/c05fabd2-5952-4ebf-b157-1c5bb581e461/managers',
      expectedResult: false,
    },
    {
      url: '/invitations',
      expectedResult: false,
    },
    {
      url: '/some/route/c05fabd2-5952-4ebf-b157-1c5bb581e461',
      expectedResult: true,
    },
    {
      url: '/workspaces/3a765cdf-a67e-490f-a6df-a8984fe7aa5b/applets/c05fabd2-5952-4ebf-b157-1c5bb581e461/respondents/some',
      expectedResult: true,
    },
    {
      url: '/workspaces/3a765cdf-a67e-490f-a6df-a8984fe7aa5b/applets/c05fabd2-5952-4ebf-b157-1c5bb581e461/managers/some',
      expectedResult: true,
    },
    { url: '/workspaces/3a765cdf-a67e-490f-a6df-a8984fe7aa5b/managers/some', expectedResult: true },
    {
      url: '/workspaces/3a765cdf-a67e-490f-a6df-a8984fe7aa5b/respondents/some',
      expectedResult: true,
    },
  ];

  test.each(testCases)('should return $expectedResult for URL $url', ({ url, expectedResult }) => {
    expect(shouldNotSkipRoute(url)).toBe(expectedResult);
  });
});

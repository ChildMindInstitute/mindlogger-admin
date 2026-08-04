import axios, { AxiosError } from 'axios';

import { authStorage } from 'shared/utils/authStorage';
import {
  closeSessionSync,
  subscribeSessionSync,
} from 'shared/hooks/useSessionKeepAlive/sessionSync';
import { SESSION_CHANNEL_NAME } from 'shared/hooks/useSessionKeepAlive/sessionSync.const';
import {
  InMemoryBroadcastChannel,
  resetInMemoryBroadcastChannels,
} from 'shared/tests/InMemoryBroadcastChannel';

import { refreshTokenAndReattemptRequest, refreshTokens, shouldNotSkipRoute } from './api.utils';
import { signInRefreshTokenApi } from './api';

vi.mock('./api', () => ({ signInRefreshTokenApi: vi.fn() }));
vi.mock('axios', () => ({ default: vi.fn() }));

const mockedSignInRefreshTokenApi = vi.mocked(signInRefreshTokenApi);
const mockedAxios = vi.mocked(axios);

const tokens = { accessToken: 'new-access', refreshToken: 'new-refresh', tokenType: 'Bearer' };

const resolveWith = (result: typeof tokens | undefined, delayMs = 0) =>
  mockedSignInRefreshTokenApi.mockImplementation(
    () =>
      new Promise((resolve) => {
        setTimeout(() => resolve({ data: { result } } as never), delayMs);
      }),
  );

describe('refreshTokens', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authStorage.setAccessToken('old-access');
    authStorage.setRefreshToken('old-refresh');
  });

  test('stores both tokens and returns them', async () => {
    resolveWith(tokens);

    await expect(refreshTokens()).resolves.toEqual({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });
    expect(authStorage.getAccessToken()).toBe('new-access');
    expect(authStorage.getRefreshToken()).toBe('new-refresh');
  });

  test('sends the stored refresh token', async () => {
    resolveWith(tokens);
    await refreshTokens();

    expect(mockedSignInRefreshTokenApi).toHaveBeenCalledWith({ refreshToken: 'old-refresh' });
  });

  test('overlapping callers share a single request', async () => {
    resolveWith(tokens, 10);

    const results = await Promise.all([refreshTokens(), refreshTokens(), refreshTokens()]);

    expect(mockedSignInRefreshTokenApi).toHaveBeenCalledTimes(1);
    expect(results[0]).toBe(results[1]);
    expect(results[1]).toBe(results[2]);
  });

  test('a later caller triggers a new request', async () => {
    resolveWith(tokens);

    await refreshTokens();
    await refreshTokens();

    expect(mockedSignInRefreshTokenApi).toHaveBeenCalledTimes(2);
  });

  test('rejects every overlapping caller when the request fails', async () => {
    mockedSignInRefreshTokenApi.mockRejectedValue(new Error('network down'));

    await expect(Promise.all([refreshTokens(), refreshTokens()])).rejects.toThrow('network down');
    expect(mockedSignInRefreshTokenApi).toHaveBeenCalledTimes(1);
  });

  test('allows a retry after a failure', async () => {
    mockedSignInRefreshTokenApi.mockRejectedValueOnce(new Error('network down'));
    await expect(refreshTokens()).rejects.toThrow('network down');

    resolveWith(tokens);

    await expect(refreshTokens()).resolves.toEqual({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });
  });

  test('rejects when the response is missing a token', async () => {
    resolveWith(undefined);

    await expect(refreshTokens()).rejects.toThrow('Access token refresh failed.');
    expect(authStorage.getAccessToken()).toBe('old-access');
  });
});

const tokenWithClaims = (claims: Record<string, string>) =>
  `header.${btoa(JSON.stringify(claims))}.signature`;

describe('refreshTokens broadcast', () => {
  let onSiblingMessage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
    // Stands in for this tab's engine, without which nothing is broadcast at all.
    subscribeSessionSync(vi.fn());

    const sibling = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);
    onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;
  });

  afterEach(() => {
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    vi.unstubAllGlobals();
  });

  test('announces the new tokens to sibling tabs', async () => {
    authStorage.setRefreshToken(tokenWithClaims({ family: 'family-1' }));
    resolveWith(tokens);

    await refreshTokens();

    expect(onSiblingMessage).toHaveBeenCalledWith({
      data: {
        type: 'TOKENS_UPDATED',
        payload: {
          sessionId: 'family-1',
          accessToken: 'new-access',
          refreshToken: 'new-refresh',
        },
      },
    });
  });

  test('announces the id siblings still hold, not the incoming one', async () => {
    authStorage.setRefreshToken(tokenWithClaims({ jti: 'jti-old' }));
    resolveWith({
      accessToken: 'new-access',
      refreshToken: tokenWithClaims({ jti: 'jti-new' }),
      tokenType: 'Bearer',
    });

    await refreshTokens();

    expect(onSiblingMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          payload: expect.objectContaining({ sessionId: 'jti-old' }),
        }),
      }),
    );
  });

  test('announces nothing when the refresh fails', async () => {
    authStorage.setRefreshToken(tokenWithClaims({ family: 'family-1' }));
    mockedSignInRefreshTokenApi.mockRejectedValue(new Error('network down'));

    await expect(refreshTokens()).rejects.toThrow('network down');

    expect(onSiblingMessage).not.toHaveBeenCalled();
  });

  test('announces nothing when the token carries no session id', async () => {
    authStorage.setRefreshToken('opaque-token');
    resolveWith(tokens);

    await refreshTokens();

    expect(onSiblingMessage).not.toHaveBeenCalled();
  });
});

describe('refreshTokenAndReattemptRequest', () => {
  const failedRequest = {
    response: { config: { url: '/applets', method: 'get', headers: { 'X-Custom': '1' } } },
  } as unknown as AxiosError;

  beforeEach(() => {
    vi.clearAllMocks();
    authStorage.setRefreshToken('old-refresh');
  });

  test('replays the original request with the new token', async () => {
    resolveWith(tokens);
    mockedAxios.mockResolvedValue({ data: 'replayed' } as never);

    await expect(refreshTokenAndReattemptRequest(failedRequest)).resolves.toEqual({
      data: 'replayed',
    });
    expect(mockedAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/applets',
        headers: { 'X-Custom': '1', Authorization: 'Bearer new-access' },
      }),
    );
  });

  test('propagates a failed refresh without replaying', async () => {
    mockedSignInRefreshTokenApi.mockRejectedValue(new Error('refresh rejected'));

    await expect(refreshTokenAndReattemptRequest(failedRequest)).rejects.toThrow(
      'refresh rejected',
    );
    expect(mockedAxios).not.toHaveBeenCalled();
  });
});

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

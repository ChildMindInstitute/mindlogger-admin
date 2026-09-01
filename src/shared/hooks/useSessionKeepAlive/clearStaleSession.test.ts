import { AxiosResponse } from 'axios';

import { deleteRefreshTokenApi } from 'modules/Auth/api';
import { authStorage } from 'shared/utils';

import { clearStaleSession } from './clearStaleSession';
import { getLastActivityAt, setLastActivityAt } from './sessionStore';
import { MS_IN_MIN } from './useSessionKeepAlive.const';

// Pinned so the suite does not depend on the .env a developer happens to have locally.
vi.mock('./useSessionKeepAlive.utils', () => ({
  resolveSessionConfig: () => ({ idleTimeoutMs: 30 * 60 * 1000, refreshLeadMs: 90 * 1000 }),
}));

vi.mock('modules/Auth/api', () => ({
  deleteRefreshTokenApi: vi.fn(() => Promise.resolve()),
}));

const IDLE_TIMEOUT_MS = 30 * MS_IN_MIN;

// Only the exp claim is read, so the header and signature are placeholders.
const jwtExpiringIn = (ms: number) =>
  `header.${btoa(JSON.stringify({ exp: Math.floor((Date.now() + ms) / 1000) }))}.signature`;

const goStale = () => setLastActivityAt(Date.now() - IDLE_TIMEOUT_MS - 1);

describe('clearStaleSession', () => {
  beforeEach(() => {
    vi.mocked(deleteRefreshTokenApi).mockClear();
    localStorage.clear();
    sessionStorage.clear();
    authStorage.setAccessToken('access-token');
    authStorage.setRefreshToken('refresh-token');
  });

  test('clears a session left idle past its deadline', async () => {
    goStale();

    await clearStaleSession();

    expect(authStorage.getRefreshToken()).toBeNull();
    expect(getLastActivityAt()).toBeNull();
  });

  // sessionStorage survives a reload, and holds the applet private keys.
  test('clears the applet private keys a reload would otherwise keep', async () => {
    sessionStorage.setItem('applet-key', 'private-key');
    goStale();

    await clearStaleSession();

    expect(sessionStorage.getItem('applet-key')).toBeNull();
  });

  test('keeps a session still inside the idle window', async () => {
    sessionStorage.setItem('applet-key', 'private-key');
    setLastActivityAt(Date.now() - IDLE_TIMEOUT_MS + MS_IN_MIN);

    await clearStaleSession();

    expect(authStorage.getRefreshToken()).toBe('refresh-token');
    expect(sessionStorage.getItem('applet-key')).toBe('private-key');
  });

  test('leaves a session with no activity clock to the usual 401 path', async () => {
    await clearStaleSession();

    expect(authStorage.getRefreshToken()).toBe('refresh-token');
  });

  describe('revoking on the server', () => {
    // What an idle timeout shorter than the token's lifetime would leave behind.
    test('revokes a refresh token the server would still accept', async () => {
      authStorage.setRefreshToken(jwtExpiringIn(MS_IN_MIN));
      goStale();

      await clearStaleSession();

      expect(deleteRefreshTokenApi).toHaveBeenCalledTimes(1);
      expect(authStorage.getRefreshToken()).toBeNull();
    });

    // The interceptor reads the token from the store as it dispatches, so clearing first would
    // send the revoke with no token on it at all.
    test('revokes before it clears, so the token is still there to send', async () => {
      const token = jwtExpiringIn(MS_IN_MIN);
      let tokenWhenAsked: string | null = null;
      vi.mocked(deleteRefreshTokenApi).mockImplementationOnce(() => {
        tokenWhenAsked = authStorage.getRefreshToken();

        return Promise.resolve({} as AxiosResponse);
      });
      authStorage.setRefreshToken(token);
      goStale();

      await clearStaleSession();

      expect(tokenWhenAsked).toBe(token);
    });

    // Today's config: the token expires as the session goes stale, so there is nothing to ask about.
    test('does not ask about a refresh token that has already expired', async () => {
      authStorage.setRefreshToken(jwtExpiringIn(-MS_IN_MIN));
      goStale();

      await clearStaleSession();

      expect(deleteRefreshTokenApi).not.toHaveBeenCalled();
      expect(authStorage.getRefreshToken()).toBeNull();
    });

    test('does not ask about a token it cannot read an expiry from', async () => {
      goStale();

      await clearStaleSession();

      expect(deleteRefreshTokenApi).not.toHaveBeenCalled();
    });

    test('clears the session even when the revoke fails', async () => {
      vi.mocked(deleteRefreshTokenApi).mockRejectedValueOnce(new Error('request failed'));
      authStorage.setRefreshToken(jwtExpiringIn(MS_IN_MIN));
      goStale();

      await clearStaleSession();

      expect(authStorage.getRefreshToken()).toBeNull();
      expect(getLastActivityAt()).toBeNull();
    });
  });
});

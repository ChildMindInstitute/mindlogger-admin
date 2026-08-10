import { authStorage } from 'shared/utils';

import { clearStaleSession } from './clearStaleSession';
import { getLastActivityAt, setLastActivityAt } from './sessionStore';
import { MS_IN_MIN } from './useSessionKeepAlive.const';

// Pinned so the suite does not depend on the .env a developer happens to have locally.
vi.mock('./useSessionKeepAlive.utils', () => ({
  resolveSessionConfig: () => ({ idleTimeoutMs: 30 * 60 * 1000, refreshLeadMs: 90 * 1000 }),
}));

const IDLE_TIMEOUT_MS = 30 * MS_IN_MIN;

describe('clearStaleSession', () => {
  beforeEach(() => {
    localStorage.clear();
    authStorage.setAccessToken('access-token');
    authStorage.setRefreshToken('refresh-token');
  });

  test('clears a session left idle past its deadline', () => {
    setLastActivityAt(Date.now() - IDLE_TIMEOUT_MS - 1);

    clearStaleSession();

    expect(authStorage.getRefreshToken()).toBeNull();
    expect(getLastActivityAt()).toBeNull();
  });

  test('keeps a session still inside the idle window', () => {
    setLastActivityAt(Date.now() - IDLE_TIMEOUT_MS + MS_IN_MIN);

    clearStaleSession();

    expect(authStorage.getRefreshToken()).toBe('refresh-token');
  });

  test('leaves a session with no activity clock to the usual 401 path', () => {
    clearStaleSession();

    expect(authStorage.getRefreshToken()).toBe('refresh-token');
  });
});

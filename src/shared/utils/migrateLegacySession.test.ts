import { getLastActivityAt } from 'shared/hooks/useSessionKeepAlive/sessionStore';

import { authStorage } from './authStorage';
import { migrateLegacySession } from './migrateLegacySession';

const seedLegacySession = () => {
  sessionStorage.setItem('accessToken', JSON.stringify('legacy-access'));
  sessionStorage.setItem('refreshToken', JSON.stringify('legacy-refresh'));
};

describe('migrateLegacySession', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  test('adopts a session left in the old store and clears the old keys', () => {
    seedLegacySession();

    migrateLegacySession();

    expect(authStorage.getAccessToken()).toBe('legacy-access');
    expect(authStorage.getRefreshToken()).toBe('legacy-refresh');
    expect(sessionStorage.getItem('accessToken')).toBeNull();
    expect(sessionStorage.getItem('refreshToken')).toBeNull();
  });

  test('carries the idle clock across so the session keeps its deadline', () => {
    const lastActivityAt = Date.now() - 60000;
    seedLegacySession();
    sessionStorage.setItem('lastActivityAt', String(lastActivityAt));

    migrateLegacySession();

    expect(getLastActivityAt()).toBe(lastActivityAt);
  });

  test('leaves a session already in the new store alone', () => {
    authStorage.setAccessToken('current-access');
    authStorage.setRefreshToken('current-refresh');
    seedLegacySession();

    migrateLegacySession();

    expect(authStorage.getRefreshToken()).toBe('current-refresh');
  });

  test('does nothing when there is no session to migrate', () => {
    migrateLegacySession();

    expect(authStorage.getRefreshToken()).toBeNull();
  });
});

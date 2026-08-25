import { authStorage } from 'shared/utils/authStorage';

import { clearSessionState, setActiveSessionId } from './sessionStore';
import { getSessionId, ownsActiveSession } from './sessionSync.utils';

const tokenWithClaims = (claims: Record<string, unknown>) =>
  `header.${btoa(JSON.stringify(claims))}.signature`;

describe('getSessionId', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('prefers the family claim, which survives rotation', () => {
    authStorage.setRefreshToken(tokenWithClaims({ family: 'family-1', jti: 'jti-1' }));

    expect(getSessionId()).toBe('family-1');
  });

  test('falls back to jti when family is missing', () => {
    authStorage.setRefreshToken(tokenWithClaims({ jti: 'jti-1' }));

    expect(getSessionId()).toBe('jti-1');
  });

  test('returns null when neither claim is present', () => {
    authStorage.setRefreshToken(tokenWithClaims({ sub: 'user-1' }));

    expect(getSessionId()).toBeNull();
  });

  test('returns null without a refresh token', () => {
    expect(getSessionId()).toBeNull();
  });
});

describe('ownsActiveSession', () => {
  beforeEach(() => {
    localStorage.clear();
    authStorage.setRefreshToken(tokenWithClaims({ family: 'family-1' }));
  });

  test('owns the session it claimed', () => {
    setActiveSessionId('family-1');

    expect(ownsActiveSession()).toBe(true);
  });

  // What a tab that slept through a logout and someone else signing in wakes up to.
  test('does not own a session that started while it slept', () => {
    setActiveSessionId('family-2');

    expect(ownsActiveSession()).toBe(false);
  });

  // Sessions predating this check have nothing recorded, and are left to behave as they always did.
  test('claims nothing recorded, so an older session is left alone', () => {
    expect(ownsActiveSession()).toBe(true);
  });

  test('claims a session whose identity was cleared alongside its clock', () => {
    setActiveSessionId('family-2');
    clearSessionState();

    expect(ownsActiveSession()).toBe(true);
  });

  // A tab that cannot name its own session has no business clearing the shared store.
  test('does not own the browser when its own token is unreadable', () => {
    authStorage.removeRefreshToken();
    setActiveSessionId('family-2');

    expect(ownsActiveSession()).toBe(false);
  });
});

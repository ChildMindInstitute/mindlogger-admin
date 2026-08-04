import { authStorage } from 'shared/utils/authStorage';

import { getSessionId } from './sessionSync.utils';

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

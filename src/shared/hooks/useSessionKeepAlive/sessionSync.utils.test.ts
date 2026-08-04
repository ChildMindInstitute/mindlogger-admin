import { authStorage } from 'shared/utils/authStorage';

import {
  getLoginAt,
  getRotatedAt,
  getSessionId,
  stampLoginAt,
  stampRotatedAt,
} from './sessionSync.utils';
import { MS_IN_MIN } from './useSessionKeepAlive.const';

const tokenWithClaims = (claims: Record<string, unknown>) =>
  `header.${btoa(JSON.stringify(claims))}.signature`;

describe('sessionSync.utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-30T10:00:00Z'));
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getSessionId', () => {
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

  describe('timestamps', () => {
    test('stamps loginAt at the current time', () => {
      stampLoginAt();

      expect(getLoginAt()).toBe(Date.now());
    });

    test('stamps loginAt at an inherited time', () => {
      const earlier = Date.now() - 20 * MS_IN_MIN;

      stampLoginAt(earlier);

      expect(getLoginAt()).toBe(earlier);
    });

    test('stamps rotatedAt at the current time', () => {
      stampRotatedAt();

      expect(getRotatedAt()).toBe(Date.now());
    });

    test('reads null when nothing is stamped', () => {
      expect(getLoginAt()).toBeNull();
      expect(getRotatedAt()).toBeNull();
    });
  });
});

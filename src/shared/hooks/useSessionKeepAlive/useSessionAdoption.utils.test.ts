import { authStorage } from 'shared/utils/authStorage';

import { getLastActivityAt } from './activityTracker';
import { SessionState } from './sessionSync.types';
import { getLoginAt, getRotatedAt } from './sessionSync.utils';
import { adoptSession, pickNewestSession } from './useSessionAdoption.utils';
import { MS_IN_MIN } from './useSessionKeepAlive.const';

const session = (overrides: Partial<SessionState> = {}): SessionState => ({
  sessionId: 'family-1',
  loginAt: Date.now(),
  rotatedAt: Date.now(),
  lastActivityAt: Date.now(),
  accessToken: 'access-1',
  refreshToken: `header.${btoa(JSON.stringify({ family: 'family-1' }))}.signature`,
  ...overrides,
});

describe('useSessionAdoption.utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-30T10:00:00Z'));
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('picks the most recent login, sorting undated sessions oldest', () => {
    const undated = session({ sessionId: 'family-1', loginAt: null });
    const older = session({ sessionId: 'family-2', loginAt: Date.now() - 20 * MS_IN_MIN });
    const newest = session({ sessionId: 'family-3', loginAt: Date.now() });

    expect(pickNewestSession([newest, undated, older])).toBe(newest);
    expect(pickNewestSession([undated, older])).toBe(older);
    expect(pickNewestSession([])).toBeNull();
  });

  test('stores the tokens, inherits the stamps, and counts the adoption as activity', () => {
    const loginAt = Date.now() - 20 * MS_IN_MIN;
    const rotatedAt = Date.now() - 5 * MS_IN_MIN;

    adoptSession(session({ loginAt, rotatedAt }));

    expect(authStorage.getAccessToken()).toBe('access-1');
    expect(getLoginAt()).toBe(loginAt);
    expect(getRotatedAt()).toBe(rotatedAt);
    expect(getLastActivityAt()).toBe(Date.now());
  });
});

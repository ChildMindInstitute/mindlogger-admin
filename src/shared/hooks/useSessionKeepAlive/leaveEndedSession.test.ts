import { authStorage } from 'shared/utils/authStorage';
import { SessionStorageKeys } from 'shared/utils/storage';

import { leaveEndedSession } from './leaveEndedSession';
import {
  getActiveSessionId,
  getLastActivityAt,
  setActiveSessionId,
  setLastActivityAt,
} from './sessionStore';

const mockedReload = vi.fn();

describe('leaveEndedSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
    vi.stubGlobal('location', { ...window.location, reload: mockedReload });
  });

  afterEach(() => vi.unstubAllGlobals());

  test('leaves a note for the boot on the way back in, then reloads', () => {
    leaveEndedSession();

    expect(sessionStorage.getItem(SessionStorageKeys.SessionEnded)).toBe('true');
    expect(mockedReload).toHaveBeenCalledTimes(1);
  });

  test('drops what belongs to the session that ended', () => {
    sessionStorage.setItem('applet-private-key', 'secret');

    leaveEndedSession();

    expect(sessionStorage.getItem('applet-private-key')).toBeNull();
  });

  // The shared store is the new session's now, so signing it out of every tab is exactly the harm
  // this function exists to avoid.
  test('leaves the shared store alone', () => {
    authStorage.setAccessToken('their-access');
    authStorage.setRefreshToken('their-refresh');

    leaveEndedSession();

    expect(authStorage.getAccessToken()).toBe('their-access');
    expect(authStorage.getRefreshToken()).toBe('their-refresh');
  });

  // The live session's clock and identity, which the tabs still in it are reading.
  test('leaves the running session its clock and its identity', () => {
    setLastActivityAt(Date.now());
    setActiveSessionId('family-2');

    leaveEndedSession();

    expect(getLastActivityAt()).not.toBeNull();
    expect(getActiveSessionId()).toBe('family-2');
  });
});

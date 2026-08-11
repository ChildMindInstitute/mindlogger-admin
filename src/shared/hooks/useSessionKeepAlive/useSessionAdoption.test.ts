import { act } from '@testing-library/react';

import { authStorage } from 'shared/utils';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import {
  InMemoryBroadcastChannel,
  resetInMemoryBroadcastChannels,
} from 'shared/tests/InMemoryBroadcastChannel';

import { useSessionAdoption } from './useSessionAdoption';
import { setLastActivityAt } from './sessionStore';
import { closeSessionSync } from './sessionSync';
import { SESSION_CHANNEL_NAME, SESSION_REQUEST_WINDOW_MS } from './sessionSync.const';
import { MS_IN_MIN } from './useSessionKeepAlive.const';

// Pinned so the suite does not depend on the .env a developer happens to have locally.
vi.mock('./useSessionKeepAlive.utils', () => ({
  resolveSessionConfig: () => ({ idleTimeoutMs: 30 * 60 * 1000, refreshLeadMs: 90 * 1000 }),
}));

const IDLE_TIMEOUT_MS = 30 * MS_IN_MIN;

const ANNOUNCED = {
  sessionId: 'family-1',
  accessToken: 'their-access',
  refreshToken: 'their-refresh',
};

const mockedReload = vi.fn();

const setFlag = (enableSessionKeepAlive: boolean) =>
  vi.mocked(useFeatureFlags).mockReturnValue({
    featureFlags: { enableSessionKeepAlive },
    resetLDContext: vi.fn(),
  } as never);

// Mirrors how the routes consume this: the hook re-renders, and the token is read afterwards.
const renderAdoption = () =>
  renderHookWithProviders(
    () => {
      useSessionAdoption();

      return authStorage.getAccessToken();
    },
    { preloadedState: getPreloadedState() },
  );

const announceSession = (sibling: InMemoryBroadcastChannel) =>
  act(() => {
    sibling.postMessage({ type: 'SESSION_STATE', payload: ANNOUNCED });
  });

describe('useSessionAdoption', () => {
  let sibling: InMemoryBroadcastChannel;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-30T10:00:00Z'));
    localStorage.clear();
    sessionStorage.clear();
    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
    vi.stubGlobal('location', { ...window.location, reload: mockedReload });
    setFlag(true);

    sibling = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);
  });

  afterEach(() => {
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  // Nobody replies, so the fallback window runs out.
  const wakeUnanswered = () => {
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    act(() => {
      vi.advanceTimersByTime(SESSION_REQUEST_WINDOW_MS);
    });
  };

  test('joins a session announced by another tab', () => {
    const { result } = renderAdoption();

    announceSession(sibling);

    expect(authStorage.getRefreshToken()).toBe(ANNOUNCED.refreshToken);
    expect(result.current).toBe(ANNOUNCED.accessToken);
  });

  test('leaves a tab that already holds a session alone', () => {
    authStorage.setAccessToken('my-access');
    authStorage.setRefreshToken('my-refresh');
    renderAdoption();

    announceSession(sibling);

    expect(authStorage.getRefreshToken()).toBe('my-refresh');
  });

  test('joins only once when two announcements land before it can re-render', () => {
    renderAdoption();

    act(() => {
      sibling.postMessage({ type: 'SESSION_STATE', payload: ANNOUNCED });
      sibling.postMessage({
        type: 'SESSION_STATE',
        payload: { ...ANNOUNCED, accessToken: 'stale-access', refreshToken: 'stale-refresh' },
      });
    });

    expect(authStorage.getRefreshToken()).toBe(ANNOUNCED.refreshToken);
  });

  test('ignores announcements when the flag is off', () => {
    setFlag(false);
    renderAdoption();

    announceSession(sibling);

    expect(authStorage.getRefreshToken()).toBeNull();
  });

  test('asks for a session when the tab comes back into focus', () => {
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;
    renderAdoption();

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(onSiblingMessage).toHaveBeenCalledWith({ data: { type: 'SESSION_REQUEST' } });
  });

  test('reloads into a live session when the last tab holding it has closed', () => {
    setLastActivityAt(Date.now() - MS_IN_MIN);
    renderAdoption();

    wakeUnanswered();

    expect(mockedReload).toHaveBeenCalledTimes(1);
  });

  test('does not reload when a sibling hands the session over instead', () => {
    setLastActivityAt(Date.now() - MS_IN_MIN);
    renderAdoption();
    sibling.onmessage = () => sibling.postMessage({ type: 'SESSION_STATE', payload: ANNOUNCED });

    wakeUnanswered();

    expect(mockedReload).not.toHaveBeenCalled();
  });

  test('does not reload when no session was ever left behind', () => {
    renderAdoption();

    wakeUnanswered();

    expect(mockedReload).not.toHaveBeenCalled();
  });

  test('does not reload for a session already past its idle deadline', () => {
    setLastActivityAt(Date.now() - IDLE_TIMEOUT_MS);
    renderAdoption();

    wakeUnanswered();

    expect(mockedReload).not.toHaveBeenCalled();
  });

  test('reloads only once, so a half-cleared session cannot loop', () => {
    setLastActivityAt(Date.now() - MS_IN_MIN);
    renderAdoption();

    wakeUnanswered();
    wakeUnanswered();

    expect(mockedReload).toHaveBeenCalledTimes(1);
  });

  test('stays quiet on focus once it holds a session, leaving catch-up to the engine', () => {
    authStorage.setRefreshToken('my-refresh');
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;
    renderAdoption();

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(onSiblingMessage).not.toHaveBeenCalled();
  });
});

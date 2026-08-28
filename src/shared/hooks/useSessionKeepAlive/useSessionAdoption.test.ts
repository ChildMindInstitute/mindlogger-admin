import { act } from '@testing-library/react';

import { authStorage } from 'shared/utils';
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

const renderAdoption = () =>
  renderHookWithProviders(useSessionAdoption, { preloadedState: getPreloadedState() });

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

  const bannersIn = (store: ReturnType<typeof renderAdoption>['store']) =>
    store.getState().banners.data.banners;

  test('raises the banner when another tab announces a session', () => {
    const { store } = renderAdoption();

    announceSession(sibling);

    expect(bannersIn(store)).toEqual([{ key: 'SessionElsewhereBanner' }]);
    expect(store.getState().auth.hasSessionElsewhere).toBe(true);
  });

  test('never writes the announced tokens', () => {
    renderAdoption();

    announceSession(sibling);

    expect(authStorage.getRefreshToken()).toBeNull();
    expect(authStorage.getAccessToken()).toBeNull();
  });

  test('leaves a tab that already holds a session alone', () => {
    authStorage.setAccessToken('my-access');
    authStorage.setRefreshToken('my-refresh');
    const { store } = renderAdoption();

    announceSession(sibling);

    expect(authStorage.getRefreshToken()).toBe('my-refresh');
    expect(bannersIn(store)).toEqual([]);
  });

  test('raises the banner once when two announcements land together', () => {
    const { store } = renderAdoption();

    act(() => {
      sibling.postMessage({ type: 'SESSION_STATE', payload: ANNOUNCED });
      sibling.postMessage({ type: 'SESSION_STATE', payload: ANNOUNCED });
    });

    expect(bannersIn(store)).toHaveLength(1);
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

  test('raises the banner when the last tab holding the session has closed', () => {
    setLastActivityAt(Date.now() - MS_IN_MIN);
    const { store } = renderAdoption();

    wakeUnanswered();

    expect(bannersIn(store)).toEqual([{ key: 'SessionElsewhereBanner' }]);
    // Getting there is the user's call now, so nothing reloads on its own.
    expect(mockedReload).not.toHaveBeenCalled();
  });

  test('raises the banner once when a sibling answers within the window', () => {
    setLastActivityAt(Date.now() - MS_IN_MIN);
    const { store } = renderAdoption();
    sibling.onmessage = () => sibling.postMessage({ type: 'SESSION_STATE', payload: ANNOUNCED });

    wakeUnanswered();

    expect(bannersIn(store)).toHaveLength(1);
  });

  test('stays a plain login page when no session was ever left behind', () => {
    const { store } = renderAdoption();

    wakeUnanswered();

    expect(bannersIn(store)).toEqual([]);
    expect(store.getState().auth.hasSessionElsewhere).toBe(false);
  });

  test('says nothing about a session already past its idle deadline', () => {
    setLastActivityAt(Date.now() - IDLE_TIMEOUT_MS);
    const { store } = renderAdoption();

    wakeUnanswered();

    expect(bannersIn(store)).toEqual([]);
  });

  test('raises the banner once however often the tab is woken', () => {
    setLastActivityAt(Date.now() - MS_IN_MIN);
    const { store } = renderAdoption();

    wakeUnanswered();
    wakeUnanswered();

    expect(bannersIn(store)).toHaveLength(1);
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

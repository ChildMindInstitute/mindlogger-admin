import { act, renderHook } from '@testing-library/react';

import { authStorage } from 'shared/utils/authStorage';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import {
  InMemoryBroadcastChannel,
  resetInMemoryBroadcastChannels,
} from 'shared/tests/InMemoryBroadcastChannel';

import { closeSessionSync } from './sessionSync';
import { SESSION_CHANNEL_NAME, SESSION_REQUEST_WINDOW_MS } from './sessionSync.const';
import { SessionMessage, SessionState } from './sessionSync.types';
import { useSessionAdoption } from './useSessionAdoption';
import { MS_IN_MIN } from './useSessionKeepAlive.const';

const refreshTokenFor = (sessionId: string) =>
  `header.${btoa(JSON.stringify({ family: sessionId }))}.signature`;

const tokenExpiringIn = (ms: number) =>
  `header.${btoa(JSON.stringify({ exp: Math.floor((Date.now() + ms) / 1000) }))}.signature`;

const session = (sessionId: string, loginAt: number): SessionState => ({
  sessionId,
  loginAt,
  rotatedAt: loginAt,
  lastActivityAt: loginAt,
  accessToken: `access-${sessionId}`,
  refreshToken: `header.${btoa(JSON.stringify({ family: sessionId }))}.signature`,
});

// A signed-in tab: answers SESSION_REQUEST with its session, collects everything it hears.
const openSignedInTab = (state: SessionState) => {
  const channel = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);
  const heard: SessionMessage[] = [];
  channel.onmessage = ({ data }) => {
    const message = data as SessionMessage;
    heard.push(message);
    if (message.type === 'SESSION_REQUEST') {
      channel.postMessage({ type: 'SESSION_STATE', payload: state });
    }
  };

  return heard;
};

const setFlag = (enableSessionKeepAlive: boolean) =>
  vi.mocked(useFeatureFlags).mockReturnValue({
    featureFlags: { enableSessionKeepAlive },
    resetLDContext: vi.fn(),
  } as never);

describe('useSessionAdoption', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-30T10:00:00Z'));
    sessionStorage.clear();
    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
    setFlag(true);
  });

  afterEach(() => {
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test('adopts the newest of the offered sessions and announces the activity', () => {
    openSignedInTab(session('family-1', Date.now() - 20 * MS_IN_MIN));
    const newerTabHeard = openSignedInTab(session('family-2', Date.now()));

    const { result } = renderHook(useSessionAdoption);
    expect(result.current).toBe(true);

    act(() => {
      vi.advanceTimersByTime(SESSION_REQUEST_WINDOW_MS);
    });

    expect(result.current).toBe(false);
    expect(authStorage.getAccessToken()).toBe('access-family-2');
    expect(newerTabHeard).toContainEqual({
      type: 'ACTIVITY',
      payload: { sessionId: 'family-2', lastActivityAt: Date.now() },
    });
  });

  test('settles on the login page when nobody answers, and never asks again', () => {
    const { result } = renderHook(useSessionAdoption);

    act(() => {
      vi.advanceTimersByTime(SESSION_REQUEST_WINDOW_MS + 1);
    });
    expect(result.current).toBe(false);
    expect(authStorage.getAccessToken()).toBeNull();

    // A session starting later must not be adopted by a tab already sitting on the login page.
    const heard = openSignedInTab(session('family-1', Date.now()));
    act(() => {
      vi.advanceTimersByTime(SESSION_REQUEST_WINDOW_MS + 1);
    });
    expect(heard).toHaveLength(0);
    expect(authStorage.getAccessToken()).toBeNull();
  });

  test('a tab that already has a session never asks', () => {
    authStorage.setRefreshToken('inherited-refresh');
    const heard = openSignedInTab(session('family-1', Date.now()));

    const { result } = renderHook(useSessionAdoption);

    expect(result.current).toBe(false);
    expect(heard).toHaveLength(0);
    expect(authStorage.getRefreshToken()).toBe('inherited-refresh');
  });

  test('a tab reloading with expired tokens takes fresher ones from its own session', () => {
    authStorage.setRefreshToken(refreshTokenFor('family-1'));
    authStorage.setAccessToken(tokenExpiringIn(-MS_IN_MIN));
    const fresher = { ...session('family-1', Date.now()), rotatedAt: Date.now() };
    openSignedInTab(fresher);

    const { result } = renderHook(useSessionAdoption);
    expect(result.current).toBe(true);

    act(() => {
      vi.advanceTimersByTime(SESSION_REQUEST_WINDOW_MS);
    });

    expect(result.current).toBe(false);
    expect(authStorage.getAccessToken()).toBe('access-family-1');
  });

  test('a tab reloading with expired tokens is never switched to another account', () => {
    authStorage.setRefreshToken(refreshTokenFor('family-1'));
    authStorage.setAccessToken(tokenExpiringIn(-MS_IN_MIN));
    openSignedInTab({ ...session('family-2', Date.now()), rotatedAt: Date.now() });

    renderHook(useSessionAdoption);

    act(() => {
      vi.advanceTimersByTime(SESSION_REQUEST_WINDOW_MS);
    });

    expect(authStorage.getRefreshToken()).toBe(refreshTokenFor('family-1'));
  });

  test('a healthy reload never asks and is not delayed', () => {
    authStorage.setRefreshToken(refreshTokenFor('family-1'));
    authStorage.setAccessToken(tokenExpiringIn(MS_IN_MIN));
    const heard = openSignedInTab(session('family-2', Date.now()));

    const { result } = renderHook(useSessionAdoption);

    expect(result.current).toBe(false);
    expect(heard).toHaveLength(0);
  });

  test('does nothing when the flag is off', () => {
    setFlag(false);
    const heard = openSignedInTab(session('family-1', Date.now()));

    const { result } = renderHook(useSessionAdoption);

    expect(result.current).toBe(false);
    expect(heard).toHaveLength(0);
  });
});

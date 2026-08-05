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

const session = (sessionId: string, loginAt: number): SessionState => ({
  sessionId,
  loginAt,
  rotatedAt: loginAt,
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

  test('does nothing when the flag is off', () => {
    setFlag(false);
    const heard = openSignedInTab(session('family-1', Date.now()));

    const { result } = renderHook(useSessionAdoption);

    expect(result.current).toBe(false);
    expect(heard).toHaveLength(0);
  });
});

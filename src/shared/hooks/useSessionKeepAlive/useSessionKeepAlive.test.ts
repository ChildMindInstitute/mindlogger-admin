import { act } from '@testing-library/react';

import { refreshTokens } from 'shared/api';
import { authStorage } from 'shared/utils';
import { SessionStorageKeys } from 'shared/utils/storage';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { useLogout } from 'shared/hooks/useLogout';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import {
  InMemoryBroadcastChannel,
  resetInMemoryBroadcastChannels,
} from 'shared/tests/InMemoryBroadcastChannel';
import { state as authState } from 'modules/Auth/state/Auth.state';

import { useSessionKeepAlive } from './useSessionKeepAlive';
import { closeSessionSync, publishSessionMessage } from './sessionSync';
import { SESSION_CHANNEL_NAME } from './sessionSync.const';
import { MS_IN_MIN, MS_IN_SEC } from './useSessionKeepAlive.const';

vi.mock('shared/api', () => ({ refreshTokens: vi.fn() }));
vi.mock('shared/hooks/useLogout', () => ({ useLogout: vi.fn() }));
// Pinned so the suite does not depend on the .env a developer happens to have locally.
vi.mock('./useSessionKeepAlive.utils', () => ({
  resolveSessionConfig: () => ({ idleTimeoutMs: 30 * 60 * 1000, refreshLeadMs: 90 * 1000 }),
}));

const mockedRefreshTokens = vi.mocked(refreshTokens);
const mockedLogout = vi.fn();

const IDLE_TIMEOUT_MS = 30 * MS_IN_MIN;
const TOKEN_LIFETIME_MS = 15 * MS_IN_MIN;
const REFRESH_LEAD_MS = 90 * MS_IN_SEC;

const SESSION_ID = 'family-1';

const tokenExpiringIn = (ms: number) =>
  `header.${btoa(JSON.stringify({ exp: Math.floor((Date.now() + ms) / 1000) }))}.signature`;

const refreshTokenFor = (sessionId: string) =>
  `header.${btoa(JSON.stringify({ family: sessionId }))}.signature`;

const setFlag = (enableSessionKeepAlive: boolean) =>
  vi.mocked(useFeatureFlags).mockReturnValue({
    featureFlags: { enableSessionKeepAlive },
    resetLDContext: vi.fn(),
  } as never);

const renderEngine = () =>
  renderHookWithProviders(useSessionKeepAlive, {
    preloadedState: { ...getPreloadedState(), auth: { ...authState, isAuthorized: true } },
  });

describe('useSessionKeepAlive', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-30T10:00:00Z'));
    sessionStorage.clear();

    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);

    vi.mocked(useLogout).mockReturnValue(mockedLogout);
    mockedRefreshTokens.mockResolvedValue({ accessToken: 'a', refreshToken: 'r' });
    setFlag(true);
    authStorage.setAccessToken(tokenExpiringIn(TOKEN_LIFETIME_MS));
    authStorage.setRefreshToken(refreshTokenFor(SESSION_ID));
  });

  afterEach(() => {
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test('refreshes one lead interval before the token expires', () => {
    renderEngine();

    act(() => {
      vi.advanceTimersByTime(TOKEN_LIFETIME_MS - REFRESH_LEAD_MS - MS_IN_SEC);
    });
    expect(mockedRefreshTokens).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2 * MS_IN_SEC);
    });
    expect(mockedRefreshTokens).toHaveBeenCalledTimes(1);
  });

  test('re-arms from the newly issued token', async () => {
    renderEngine();
    mockedRefreshTokens.mockImplementation(async () => {
      authStorage.setAccessToken(tokenExpiringIn(TOKEN_LIFETIME_MS));

      return { accessToken: 'a', refreshToken: 'r' };
    });

    await act(async () => {
      vi.advanceTimersByTime(TOKEN_LIFETIME_MS - REFRESH_LEAD_MS);
    });
    await act(async () => {
      vi.advanceTimersByTime(TOKEN_LIFETIME_MS - REFRESH_LEAD_MS);
    });

    expect(mockedRefreshTokens).toHaveBeenCalledTimes(2);
  });

  test('logs out once the idle timeout elapses', () => {
    renderEngine();

    act(() => {
      vi.advanceTimersByTime(IDLE_TIMEOUT_MS - MS_IN_SEC);
    });
    expect(mockedLogout).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2 * MS_IN_SEC);
    });
    expect(mockedLogout).toHaveBeenCalledWith({ shouldSoftLock: true });
  });

  test('activity pushes the logout deadline out', () => {
    renderEngine();

    act(() => {
      vi.advanceTimersByTime(IDLE_TIMEOUT_MS - MS_IN_MIN);
      window.dispatchEvent(new Event('keydown'));
    });
    act(() => {
      vi.advanceTimersByTime(2 * MS_IN_MIN);
    });

    expect(mockedLogout).not.toHaveBeenCalled();
  });

  test('logs out when the refresh is rejected', async () => {
    mockedRefreshTokens.mockRejectedValue(new Error('refresh rejected'));
    renderEngine();

    await act(async () => {
      vi.advanceTimersByTime(TOKEN_LIFETIME_MS - REFRESH_LEAD_MS);
    });

    expect(mockedLogout).toHaveBeenCalledWith({ shouldSoftLock: true });
  });

  test('caps the lead so a short-lived token does not refresh on every tick', () => {
    authStorage.setAccessToken(tokenExpiringIn(MS_IN_MIN));
    renderEngine();

    act(() => {
      vi.advanceTimersByTime(MS_IN_MIN / 2 - MS_IN_SEC);
    });
    expect(mockedRefreshTokens).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2 * MS_IN_SEC);
    });
    expect(mockedRefreshTokens).toHaveBeenCalledTimes(1);
  });

  test('adopts tokens a sibling rotated and re-arms from them', () => {
    renderEngine();
    const sibling = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);
    const rotated = tokenExpiringIn(2 * TOKEN_LIFETIME_MS);

    act(() => {
      sibling.postMessage({
        type: 'TOKENS_UPDATED',
        payload: {
          sessionId: SESSION_ID,
          accessToken: rotated,
          refreshToken: refreshTokenFor(SESSION_ID),
        },
      });
    });
    expect(authStorage.getAccessToken()).toBe(rotated);

    // The replaced token's refresh moment passes without this tab rotating again.
    act(() => {
      vi.advanceTimersByTime(TOKEN_LIFETIME_MS - REFRESH_LEAD_MS + MS_IN_SEC);
    });

    expect(mockedRefreshTokens).not.toHaveBeenCalled();
  });

  test('ignores tokens rotated in another account session', () => {
    renderEngine();
    const sibling = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);
    const mine = authStorage.getAccessToken();

    act(() => {
      sibling.postMessage({
        type: 'TOKENS_UPDATED',
        payload: {
          sessionId: 'family-2',
          accessToken: 'their-access',
          refreshToken: 'their-refresh',
        },
      });
    });

    expect(authStorage.getAccessToken()).toBe(mine);
  });

  test('a sibling reporting activity holds off this tab logout', () => {
    renderEngine();
    const sibling = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);

    act(() => {
      vi.advanceTimersByTime(IDLE_TIMEOUT_MS - MS_IN_MIN);
    });
    act(() => {
      sibling.postMessage({
        type: 'ACTIVITY',
        payload: { sessionId: SESSION_ID, lastActivityAt: Date.now() },
      });
    });
    act(() => {
      vi.advanceTimersByTime(2 * MS_IN_MIN);
    });

    expect(mockedLogout).not.toHaveBeenCalled();
  });

  test('ignores activity reported by another account session', () => {
    renderEngine();
    const sibling = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);

    act(() => {
      vi.advanceTimersByTime(IDLE_TIMEOUT_MS - MS_IN_MIN);
    });
    act(() => {
      sibling.postMessage({
        type: 'ACTIVITY',
        payload: { sessionId: 'family-2', lastActivityAt: Date.now() },
      });
    });
    act(() => {
      vi.advanceTimersByTime(2 * MS_IN_MIN);
    });

    expect(mockedLogout).toHaveBeenCalledWith({ shouldSoftLock: true });
  });

  test('does not rebroadcast the activity it adopted', () => {
    renderEngine();
    const sibling = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;

    act(() => {
      sibling.postMessage({
        type: 'ACTIVITY',
        payload: { sessionId: SESSION_ID, lastActivityAt: Date.now() },
      });
    });

    expect(onSiblingMessage).not.toHaveBeenCalled();
  });

  test('does not rebroadcast the tokens it adopted', () => {
    renderEngine();
    const sibling = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;

    act(() => {
      sibling.postMessage({
        type: 'TOKENS_UPDATED',
        payload: {
          sessionId: SESSION_ID,
          accessToken: tokenExpiringIn(TOKEN_LIFETIME_MS),
          refreshToken: refreshTokenFor(SESSION_ID),
        },
      });
    });

    expect(onSiblingMessage).not.toHaveBeenCalled();
  });

  test('does nothing at all when the flag is off', () => {
    setFlag(false);
    renderEngine();
    const sibling = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;
    const mine = authStorage.getAccessToken();

    act(() => {
      vi.advanceTimersByTime(IDLE_TIMEOUT_MS * 2);
      window.dispatchEvent(new Event('keydown'));
      publishSessionMessage({ type: 'SESSION_REQUEST' });
      sibling.postMessage({
        type: 'TOKENS_UPDATED',
        payload: {
          sessionId: SESSION_ID,
          accessToken: 'sibling-access',
          refreshToken: 'sibling-refresh',
        },
      });
    });

    expect(mockedRefreshTokens).not.toHaveBeenCalled();
    expect(mockedLogout).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(SessionStorageKeys.LastActivityAt)).toBeNull();
    // Neither direction: nothing published, and a sibling's message is not acted on.
    expect(onSiblingMessage).not.toHaveBeenCalled();
    expect(authStorage.getAccessToken()).toBe(mine);
  });
});

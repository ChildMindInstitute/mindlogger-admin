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
import { closeSessionSync } from './sessionSync';
import { SESSION_CHANNEL_NAME } from './sessionSync.const';

const ANNOUNCED = {
  sessionId: 'family-1',
  accessToken: 'their-access',
  refreshToken: 'their-refresh',
};

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
    localStorage.clear();
    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
    setFlag(true);

    sibling = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);
  });

  afterEach(() => {
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    vi.unstubAllGlobals();
  });

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

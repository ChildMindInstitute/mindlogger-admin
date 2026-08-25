import { waitFor } from '@testing-library/react';
import axios from 'axios';

import { page } from 'resources';
import { ApiResponseCodes } from 'api';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import {
  InMemoryBroadcastChannel,
  resetInMemoryBroadcastChannels,
} from 'shared/tests/InMemoryBroadcastChannel';
import { authStorage } from 'shared/utils/authStorage';
import { LocationStateKeys } from 'shared/types/navigation';

import { useLogout } from './useLogout';
import { closeSessionSync, subscribeSessionSync } from './useSessionKeepAlive/sessionSync';
import { SESSION_CHANNEL_NAME } from './useSessionKeepAlive/sessionSync.const';
import {
  getLastActivityAt,
  setActiveSessionId,
  setLastActivityAt,
} from './useSessionKeepAlive/sessionStore';

const clearWorkspacePayload = {
  payload: null,
  type: 'workspaces/setCurrentWorkspace',
};
const resetAlertsPayload = {
  payload: undefined,
  type: 'alerts/resetAlerts',
};
const resetAuthorizationPayload = {
  payload: undefined,
  type: 'auth/resetAuthorization',
};

const withoutPrompt = { state: { [LocationStateKeys.ShouldNavigateWithoutPrompt]: true } };

const mockedUseAppDispatch = vi.fn();
const mockedUseNavigate = vi.fn();

vi.mock('redux/store', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAppDispatch: () => mockedUseAppDispatch,
  };
});

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
  };
});

describe('useLogout', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('deleting access token navigates to login', async () => {
    const { result } = renderHookWithProviders(useLogout, { preloadedState: getPreloadedState() });
    vi.mocked(axios.post).mockResolvedValueOnce(null);

    await waitFor(() => {
      result.current();
    });

    expect(mockedUseNavigate).toBeCalledWith(page.login, withoutPrompt);
  });

  test('deleting access token resets all data', async () => {
    const { result } = renderHookWithProviders(useLogout, { preloadedState: getPreloadedState() });
    vi.mocked(axios.post).mockResolvedValueOnce(null);

    await waitFor(() => {
      result.current();
    });

    expect(mockedUseAppDispatch).nthCalledWith(1, clearWorkspacePayload);
    expect(mockedUseAppDispatch).nthCalledWith(2, resetAlertsPayload);
    expect(mockedUseAppDispatch).nthCalledWith(3, resetAuthorizationPayload);
  });

  test('delete refresh token api is called if delete access token rejects with Unauthorized status code', async () => {
    const { result } = renderHookWithProviders(useLogout, { preloadedState: getPreloadedState() });
    vi.mocked(axios.post).mockRejectedValueOnce({
      response: {
        status: ApiResponseCodes.Unauthorized,
      },
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    vi.mocked(axios.post).mockImplementation((url: string) => {
      expect(url).toBe('auth/logout2');
    });

    await waitFor(() => {
      result.current();
    });

    expect(mockedUseAppDispatch).nthCalledWith(1, clearWorkspacePayload);
    expect(mockedUseAppDispatch).nthCalledWith(2, resetAlertsPayload);
    expect(mockedUseAppDispatch).nthCalledWith(3, resetAuthorizationPayload);
    expect(mockedUseNavigate).toBeCalledWith(page.login, withoutPrompt);
  });
});

// What a tab duplicated before a logout wakes up to: its own snapshot still names the old session,
// while the browser has moved on to whoever signed in next.
describe('useLogout in a tab whose session was replaced', () => {
  const reload = vi.fn();

  beforeEach(() => {
    // This describe sits outside the one that clears mocks, and its storage writes would otherwise
    // outlive it and refuse the teardown in every describe that follows.
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    vi.stubGlobal('location', { ...window.location, reload });
    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
    // Stands in for this tab's engine, without which nothing is broadcast at all.
    subscribeSessionSync(vi.fn());
    authStorage.setRefreshToken(`header.${btoa(JSON.stringify({ family: 'user-1' }))}.signature`);
    // Written by the tab that signed in after this one went to sleep.
    setActiveSessionId('user-2');
    setLastActivityAt(Date.now());
  });

  afterEach(() => {
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    localStorage.clear();
    sessionStorage.clear();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  test('reloads into the live session instead of tearing down', async () => {
    const { result } = renderHookWithProviders(useLogout, { preloadedState: getPreloadedState() });

    await waitFor(() => {
      result.current();
    });

    expect(reload).toHaveBeenCalledTimes(1);
    expect(mockedUseAppDispatch).not.toHaveBeenCalled();
    expect(mockedUseNavigate).not.toHaveBeenCalled();
  });

  // The bug this exists for: clearing here signs out whoever now holds the browser.
  test('leaves the tokens and clock of the session that replaced it alone', async () => {
    const { result } = renderHookWithProviders(useLogout, { preloadedState: getPreloadedState() });

    await waitFor(() => {
      result.current();
    });

    expect(authStorage.getRefreshToken()).not.toBeNull();
    expect(getLastActivityAt()).not.toBeNull();
  });

  // The applet private keys live here, and sessionStorage survives the reload below.
  test('takes the private keys of the session it is leaving behind', async () => {
    sessionStorage.setItem('applet-key', 'private-key');
    const { result } = renderHookWithProviders(useLogout, { preloadedState: getPreloadedState() });

    await waitFor(() => {
      result.current();
    });

    expect(sessionStorage.getItem('applet-key')).toBeNull();
  });

  // Refusing has to come first of all: a session nobody holds has no business being announced.
  test("does not announce a logout for a session that is no longer the browser's", async () => {
    const sibling = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);
    const onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;
    const { result } = renderHookWithProviders(useLogout, { preloadedState: getPreloadedState() });

    await waitFor(() => {
      result.current();
    });

    expect(onSiblingMessage).not.toHaveBeenCalled();
  });

  test('does not ask the server to revoke a session it no longer holds', async () => {
    const { result } = renderHookWithProviders(useLogout, { preloadedState: getPreloadedState() });

    await waitFor(() => {
      result.current();
    });

    expect(axios.post).not.toHaveBeenCalled();
  });

  test('tears down as usual once it owns the session again', async () => {
    setActiveSessionId('user-1');
    const { result } = renderHookWithProviders(useLogout, { preloadedState: getPreloadedState() });
    vi.mocked(axios.post).mockResolvedValueOnce(null);

    await waitFor(() => {
      result.current();
    });

    expect(reload).not.toHaveBeenCalled();
    expect(mockedUseAppDispatch).toHaveBeenCalledWith(resetAuthorizationPayload);
  });
});

describe('useLogout session sync', () => {
  let onSiblingMessage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.stubGlobal('BroadcastChannel', InMemoryBroadcastChannel);
    // Stands in for this tab's engine, without which nothing is broadcast at all.
    subscribeSessionSync(vi.fn());
    authStorage.setRefreshToken(`header.${btoa(JSON.stringify({ family: 'family-1' }))}.signature`);

    const sibling = new InMemoryBroadcastChannel(SESSION_CHANNEL_NAME);
    onSiblingMessage = vi.fn();
    sibling.onmessage = onSiblingMessage;
  });

  afterEach(() => {
    closeSessionSync();
    resetInMemoryBroadcastChannels();
    vi.unstubAllGlobals();
  });

  const renderLogout = () =>
    renderHookWithProviders(useLogout, { preloadedState: getPreloadedState() });

  test('announces the logout to sibling tabs', async () => {
    const { result } = renderLogout();
    vi.mocked(axios.post).mockResolvedValueOnce(null);

    await waitFor(() => {
      result.current({ reason: 'idle' });
    });

    expect(onSiblingMessage).toHaveBeenCalledWith({
      data: { type: 'LOGOUT', payload: { sessionId: 'family-1', reason: 'idle' } },
    });
  });

  test('a remote logout announces nothing, so it cannot cascade', async () => {
    const { result } = renderLogout();

    await waitFor(() => {
      result.current({ isRemote: true });
    });

    expect(onSiblingMessage).not.toHaveBeenCalled();
  });

  test('a remote logout does not revoke the session a second time', async () => {
    const { result } = renderLogout();

    await waitFor(() => {
      result.current({ isRemote: true });
    });

    expect(axios.post).not.toHaveBeenCalled();
  });

  test('an idle logout navigates past the unsaved-changes blocker', async () => {
    const { result } = renderLogout();
    vi.mocked(axios.post).mockResolvedValueOnce(null);

    await waitFor(() => {
      result.current({ reason: 'idle' });
    });

    expect(mockedUseNavigate).toBeCalledWith(page.login, withoutPrompt);
  });

  test('a remote logout still tears this tab down', async () => {
    const { result } = renderLogout();

    await waitFor(() => {
      result.current({ isRemote: true });
    });

    expect(mockedUseAppDispatch).nthCalledWith(1, clearWorkspacePayload);
    expect(mockedUseAppDispatch).nthCalledWith(2, resetAlertsPayload);
    expect(mockedUseAppDispatch).nthCalledWith(3, resetAuthorizationPayload);
    expect(mockedUseNavigate).toBeCalledWith(page.login, withoutPrompt);
  });
});

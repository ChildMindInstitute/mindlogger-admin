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

import { useLogout } from './useLogout';
import { closeSessionSync, subscribeSessionSync } from './useSessionKeepAlive/sessionSync';
import { SESSION_CHANNEL_NAME } from './useSessionKeepAlive/sessionSync.const';

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

    expect(mockedUseNavigate).toBeCalledWith(page.login);
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
    expect(mockedUseNavigate).toBeCalledWith(page.login);
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

  test('a remote logout still tears this tab down', async () => {
    const { result } = renderLogout();

    await waitFor(() => {
      result.current({ isRemote: true });
    });

    expect(mockedUseAppDispatch).nthCalledWith(1, clearWorkspacePayload);
    expect(mockedUseAppDispatch).nthCalledWith(2, resetAlertsPayload);
    expect(mockedUseAppDispatch).nthCalledWith(3, resetAuthorizationPayload);
    expect(mockedUseNavigate).toBeCalledWith(page.login);
  });
});

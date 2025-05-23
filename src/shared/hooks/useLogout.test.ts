import { waitFor } from '@testing-library/react';
import axios from 'axios';

import { page } from 'resources';
import { ApiResponseCodes } from 'api';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { getPreloadedState } from 'shared/tests/getPreloadedState';

import { useLogout } from './useLogout';

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

jest.mock('redux/store', () => ({
  ...jest.requireActual('redux/store'),
  useAppDispatch: () => mockedUseAppDispatch,
}));

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

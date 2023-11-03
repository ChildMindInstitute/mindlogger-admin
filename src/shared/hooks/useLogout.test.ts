import { renderHook, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { page } from 'resources';
import { ApiResponseCodes } from 'api';

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

const mockedUseAppDispatch = jest.fn();
const mockedUseNavigate = jest.fn();

jest.mock('redux/store', () => ({
  useAppDispatch: () => mockedUseAppDispatch,
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('useLogout', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('deleting access token navigates to login', async () => {
    const { result } = renderHook(useLogout);
    mockAxios.post.mockResolvedValueOnce(null);

    await waitFor(() => {
      result.current();
    });

    expect(mockedUseNavigate).toBeCalledWith(page.login);
  });

  test('deleting access token resets all data', async () => {
    const { result } = renderHook(useLogout);
    mockAxios.post.mockResolvedValueOnce(null);

    await waitFor(() => {
      result.current();
    });

    expect(mockedUseAppDispatch).nthCalledWith(1, clearWorkspacePayload);
    expect(mockedUseAppDispatch).nthCalledWith(2, resetAlertsPayload);
    expect(mockedUseAppDispatch).nthCalledWith(3, resetAuthorizationPayload);
  });

  test('delete refresh token api is called if delete access token rejects with Unauthorized status code', async () => {
    const { result } = renderHook(useLogout);
    mockAxios.post.mockRejectedValueOnce({
      response: {
        status: ApiResponseCodes.Unauthorized,
      },
    });
    // @ts-expect-error TODO: fix type
    mockAxios.post.mockImplementation((url: string) => {
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

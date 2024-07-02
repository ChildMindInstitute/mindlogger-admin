import { act } from '@testing-library/react';
import { PreloadedState } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';

import { RootState } from 'redux/store';
import { AlertType, Workspace } from 'shared/state';
import { page } from 'resources';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { mockedAppletId, mockedApplet } from 'shared/mock';
import { ApiResponseCodes } from 'api';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { SingleApplet } from 'shared/state/Applet/Applet.schema';
import { state as popupState } from 'modules/Dashboard/state/Popups/Popups.state';

import { useNoPermissionPopup } from './NoPermissionPopup.hooks';
import { UseNoPermissionPopupReturn } from './NoPermissionPopup.types';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

const userId = 'a9990d0a-7a95-45ed-86ad-1509a9d62614';
const workspacesData = {
  result: [
    {
      ownerId: userId,
      workspaceName: 'Test Account',
    },
  ],
  count: 1,
};
const getPreloadedState = (
  hasForbiddenError = true,
  currentWorkspaceData: Workspace | null = null,
): PreloadedState<RootState> => ({
  forbiddenState: {
    data: {
      hasForbiddenError,
      redirectedFromBuilder: false,
    },
  },
  workspaces: {
    workspaces: {
      requestId: 'workspaces-request-id',
      status: 'success',
      data: {
        result: [],
        count: 1,
      },
    },
    currentWorkspace: {
      requestId: 'currentWorkspace-request-id',
      status: 'success',
      data: currentWorkspaceData,
    },
    roles: {
      requestId: 'roles-request-id',
      status: 'success',
      data: null,
    },
    workspacesRoles: {
      requestId: 'workspacesRoles-request-id',
      status: 'success',
      data: null,
    },
  },
  applet: {
    applet: {
      requestId: 'applet-request-id',
      status: 'success',
      data: {
        result: {
          ...(mockedApplet as SingleApplet),
        },
      },
    },
  },
  alerts: {
    alerts: {
      requestId: 'alerts-request-id',
      status: 'success',
      data: {
        result: [{} as AlertType],
        count: 1,
        notWatched: 1,
      },
    },
  },
  popups: {
    data: {
      applet: undefined,
      encryption: undefined,
      popupProps: {},
      deletePopupVisible: false,
      duplicatePopupsVisible: false,
      transferOwnershipPopupVisible: false,
      publishConcealPopupVisible: false,
    },
  },
  auth: {
    isAuthorized: true,
    isLogoutInProgress: false,
    authentication: {
      requestId: 'auth-request-id',
      status: 'success',
      data: {
        user: {
          email: '',
          firstName: '',
          lastName: '',
          id: userId,
        },
      },
    },
  },
});

const successfulGetAlertsMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [],
    notWatched: 0,
    count: 0,
  },
};

describe('useNoPermissionPopup', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
  });

  test('should return correct values and call dispatch on handleSubmit', async () => {
    mockAxios.get.mockResolvedValueOnce(successfulGetAlertsMock);
    mockAxios.get.mockResolvedValueOnce({
      data: workspacesData,
    });
    const { result, store } = renderHookWithProviders(useNoPermissionPopup, {
      preloadedState: getPreloadedState(true),
    });

    const currentResult = result.current as UseNoPermissionPopupReturn;
    expect(currentResult.noAccessVisible).toBe(true);
    expect(currentResult.isBuilder).toBe(false);
    expect(store.getState().forbiddenState.data.hasForbiddenError).toBeTruthy();
    expect(store.getState().applet.applet.data?.result).toStrictEqual({
      ...(mockedApplet as SingleApplet),
    });
    expect(store.getState().alerts.alerts.data).toStrictEqual({
      result: [{} as AlertType],
      count: 1,
      notWatched: 1,
    });

    await act(async () => {
      await currentResult.handleSubmit();
    });

    expect(store.getState().forbiddenState.data.hasForbiddenError).toBeFalsy();
    expect(store.getState().applet.applet.data).toBeNull();
    expect(store.getState().alerts.alerts.data).toStrictEqual({
      result: [],
      count: 0,
      notWatched: 0,
    });
    expect(mockAxios.get).nthCalledWith(1, `/alerts`, {
      params: {
        limit: DEFAULT_ROWS_PER_PAGE,
      },
      signal: expect.any(Object),
    });
    expect(store.getState().popups.data).toStrictEqual({
      ...popupState.data,
    });
    expect(mockAxios.get).nthCalledWith(2, `/workspaces`, {
      signal: expect.any(Object),
    });
    expect(store.getState().workspaces.currentWorkspace.data).toStrictEqual(
      workspacesData.result[0],
    );

    expect(mockedUseNavigate).toHaveBeenCalledWith(page.dashboardApplets, {
      state: {
        workspace: workspacesData.result[0],
      },
    });
  });

  test('should reload window when on dashboard applets page if current user workspace is active', async () => {
    mockAxios.get.mockResolvedValueOnce(successfulGetAlertsMock);
    mockAxios.get.mockResolvedValueOnce({
      data: workspacesData,
    });
    const reloadSpy = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    });

    const { result } = renderHookWithProviders(useNoPermissionPopup, {
      preloadedState: getPreloadedState(true, {
        ownerId: userId,
        workspaceName: 'current user workspace',
      }),
      route: page.dashboardApplets,
      routePath: page.dashboardApplets,
    });

    const currentResult = result.current as UseNoPermissionPopupReturn;

    await act(async () => {
      await currentResult.handleSubmit();
    });

    expect(reloadSpy).toHaveBeenCalled();
    expect(mockedUseNavigate).not.toHaveBeenCalled();
  });

  test('should set noAccessVisible to false when hasForbiddenError is false', () => {
    const { result } = renderHookWithProviders(useNoPermissionPopup, {
      preloadedState: getPreloadedState(false),
      route: '/dashboard/applets',
      routePath: page.dashboardApplets,
    });

    const currentResult = result.current as UseNoPermissionPopupReturn;

    expect(currentResult.noAccessVisible).toBe(false);
  });

  test('should set redirectedFromBuilder global state to true, and isBuilder to true when has builder pathname', async () => {
    const { result, store } = renderHookWithProviders(useNoPermissionPopup, {
      preloadedState: getPreloadedState(),
      route: `/builder/${mockedAppletId}/about`,
      routePath: page.builderAppletAbout,
    });

    const currentResult = result.current as UseNoPermissionPopupReturn;

    expect(currentResult.isBuilder).toBe(true);

    await act(async () => {
      await currentResult.handleSubmit();
    });

    expect(store.getState().forbiddenState.data.redirectedFromBuilder).toBeTruthy();

    // set redirectedFromBuilder to false after setting the workspace and navigating to the dashboard
    mockAxios.get.mockResolvedValueOnce(successfulGetAlertsMock);
    mockAxios.get.mockResolvedValueOnce({
      data: workspacesData,
    });

    await act(async () => {
      await currentResult.handleSubmit();
    });

    expect(mockedUseNavigate).toHaveBeenCalledWith(page.dashboardApplets, {
      state: {
        workspace: workspacesData.result[0],
      },
    });
    expect(store.getState().forbiddenState.data.redirectedFromBuilder).toBeFalsy();
  });
});

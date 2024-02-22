import { act } from '@testing-library/react';
import { PreloadedState } from '@reduxjs/toolkit';

import { RootState } from 'redux/store';
import { alerts, applet } from 'shared/state';
import { popups } from 'modules/Dashboard/state';
import { page } from 'resources';
import { forbiddenState } from 'shared/state/ForbiddenState';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { mockedAppletId } from 'shared/mock';

import { useNoPermissionPopup } from './NoPermissionPopup.hooks';
import { UseNoPermissionPopupReturn } from './NoPermissionPopup.types';

const mockedUseNavigate = jest.fn();
const mockedUseAppDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));
jest.mock('redux/store', () => ({
  ...jest.requireActual('redux/store'),
  useAppDispatch: () => mockedUseAppDispatch,
}));

const getPreloadedState = (hasForbiddenError = true): PreloadedState<RootState> => ({
  forbiddenState: {
    data: {
      hasForbiddenError,
    },
  },
});

describe('useNoPermissionPopup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return correct values and call dispatch on handleSubmit', () => {
    const { result } = renderHookWithProviders(useNoPermissionPopup, {
      preloadedState: getPreloadedState(),
    });

    const currentResult = result.current as UseNoPermissionPopupReturn;
    expect(currentResult.noAccessVisible).toBe(true);
    expect(currentResult.isBuilder).toBe(false);

    act(() => {
      currentResult.handleSubmit();
    });

    expect(mockedUseAppDispatch).toHaveBeenCalledTimes(5);
    expect(mockedUseAppDispatch).toHaveBeenCalledWith(forbiddenState.actions.clearForbiddenError());
    expect(mockedUseAppDispatch).toHaveBeenCalledWith(applet.actions.resetApplet());
    expect(mockedUseAppDispatch).toHaveBeenCalledWith(alerts.actions.resetAlerts());
    expect(mockedUseAppDispatch).toHaveBeenCalledWith(expect.any(Function));
    expect(mockedUseAppDispatch).toHaveBeenCalledWith(popups.actions.resetPopupsVisibility());
    expect(mockedUseNavigate).toHaveBeenCalledWith(page.dashboardApplets);
  });

  test('should reload window when on dashboard applets page', () => {
    const reloadSpy = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    });

    const { result } = renderHookWithProviders(useNoPermissionPopup, {
      preloadedState: getPreloadedState(),
      route: page.dashboardApplets,
      routePath: page.dashboardApplets,
    });

    const currentResult = result.current as UseNoPermissionPopupReturn;

    act(() => {
      currentResult.handleSubmit();
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

  test('should set isBuilder to true when has builder pathname', () => {
    const { result } = renderHookWithProviders(useNoPermissionPopup, {
      preloadedState: getPreloadedState(),
      route: `/builder/${mockedAppletId}/about`,
      routePath: page.builderAppletAbout,
    });

    const currentResult = result.current as UseNoPermissionPopupReturn;

    expect(currentResult.isBuilder).toBe(true);
  });
});

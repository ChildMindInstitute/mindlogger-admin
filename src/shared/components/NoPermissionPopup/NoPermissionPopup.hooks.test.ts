import { act } from '@testing-library/react';
import { PreloadedState } from '@reduxjs/toolkit';

import { RootState } from 'redux/store';
import { alerts, applet } from 'shared/state';
import { popups } from 'modules/Dashboard/state';
import { page } from 'resources';
import { forbiddenState } from 'shared/state/ForbiddenState';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';

import { useNoPermissionPopup } from './NoPermissionPopup.hooks';
import { UseNoPermissionPopupReturn } from './NoPermissionPopup.types';

// import { useNoPermissionPopup } from './useNoPermissionPopup.hooks';

const mockedUseNavigate = jest.fn();
const mockedUseLocation = jest.fn();
const mockedUseAppDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: () => mockedUseLocation,
}));
jest.mock('redux/store', () => ({
  ...jest.requireActual('redux/store'),
  useAppDispatch: () => mockedUseAppDispatch,
}));

const state: PreloadedState<RootState> = {
  forbiddenState: {
    data: {
      hasForbiddenError: true,
    },
  },
};

// jest.mock('react-router-dom', () => ({
//   useLocation: jest.fn(),
//   useNavigate: jest.fn(),
// }));

// jest.mock('redux/store', () => ({
//   useAppDispatch: jest.fn(),
// }));
//
// jest.mock('shared/state/ForbiddenState', () => ({
//   forbiddenState: {
//     useData: jest.fn(),
//   },
// }));
//
// jest.mock('shared/utils/urlGenerator', () => ({
//   checkIfDashboardAppletsUrlPassed: jest.fn(),
// }));

describe('useNoPermissionPopup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return correct values and call dispatch on handleSubmit', () => {
    const { result } = renderHookWithProviders(useNoPermissionPopup, { preloadedState: state });

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

  // test('should reload window when on dashboard applets page', () => {
  //   checkIfDashboardAppletsUrlPassed.mockReturnValue(true);
  // jest.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: 'new-applet' });
  //
  //   const { result } = renderHook(() => useNoPermissionPopup());
  //
  //   act(() => {
  //     result.current.handleSubmit();
  //   });
  //
  //   expect(window.location.reload).toHaveBeenCalled();
  // });
  //
  // test('should set noAccessVisible to true when hasForbiddenError is true', () => {
  //   forbiddenState.useData.mockReturnValue({ hasForbiddenError: true });
  //
  //   const { result } = renderHook(() => useNoPermissionPopup());
  //
  //   expect(result.current.noAccessVisible).toBe(true);
  // });
  //
  // test('should not call dispatch functions when hasForbiddenError is false', () => {
  //   forbiddenState.useData.mockReturnValue({ hasForbiddenError: false });
  //
  //   const { result } = renderHook(() => useNoPermissionPopup());
  //
  //   act(() => {
  //     result.current.handleSubmit();
  //   });
  //
  //   expect(mockedUseAppDispatch).not.toHaveBeenCalled();
  // });
});

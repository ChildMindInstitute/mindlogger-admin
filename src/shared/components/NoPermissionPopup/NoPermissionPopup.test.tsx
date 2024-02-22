import { fireEvent, screen } from '@testing-library/react';
import { PreloadedState } from '@reduxjs/toolkit';

import { mockedAppletId } from 'shared/mock';
import { page } from 'resources';
import { renderWithProviders } from 'shared/utils';
import { RootState } from 'redux/store';

import { NoPermissionPopup } from './NoPermissionPopup';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

const getPreloadedState = (hasForbiddenError = true): PreloadedState<RootState> => ({
  forbiddenState: {
    data: {
      hasForbiddenError,
    },
  },
});

describe('NoPermissionPopup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render for a dashboard and submit', () => {
    const route = `/dashboard/${mockedAppletId}/add-user`;
    const routePath = page.appletAddUser;
    const { getByTestId, queryByTestId } = renderWithProviders(<NoPermissionPopup />, {
      route,
      routePath,
      preloadedState: getPreloadedState(),
    });

    expect(getByTestId('no-permission-popup')).toBeVisible();
    expect(screen.getByText('No access to applet')).toBeVisible();
    expect(screen.getByText('To refresh the data, please click the button below.')).toBeVisible();

    fireEvent.click(screen.getByText('Refresh'));

    expect(mockedUseNavigate).toBeCalledWith('/dashboard/applets');
    expect(queryByTestId('no-permission-popup')).not.toBeInTheDocument();
  });

  test('should render for a builder and submit', () => {
    const route = `/builder/${mockedAppletId}/about`;
    const routePath = page.builderAppletAbout;
    const { getByTestId, queryByTestId } = renderWithProviders(<NoPermissionPopup />, {
      route,
      routePath,
      preloadedState: getPreloadedState(),
    });

    expect(getByTestId('no-permission-popup')).toBeVisible();
    expect(screen.getByText('To refresh the data, please click the button below.')).toBeVisible();

    fireEvent.click(screen.getByText('Go to Dashboard'));

    expect(mockedUseNavigate).toBeCalledWith('/dashboard/applets');
    expect(queryByTestId('no-permission-popup')).not.toBeInTheDocument();
  });

  test('should not render if hasForbiddenError state is false', () => {
    const route = `/builder/${mockedAppletId}/about`;
    const routePath = page.builderAppletAbout;
    const { queryByTestId } = renderWithProviders(<NoPermissionPopup />, {
      route,
      routePath,
      preloadedState: getPreloadedState(false),
    });

    expect(queryByTestId('no-permission-popup')).not.toBeInTheDocument();
  });

  test('should not navigate to the dashboard applets page again if the user is currently on this page', () => {
    const route = '/dashboard/applets';
    const routePath = page.dashboardApplets;
    const { queryByTestId } = renderWithProviders(<NoPermissionPopup />, {
      route,
      routePath,
      preloadedState: getPreloadedState(),
    });

    fireEvent.click(screen.getByText('Refresh'));

    expect(mockedUseNavigate).not.toHaveBeenCalled();
    expect(queryByTestId('no-permission-popup')).not.toBeInTheDocument();
  });
});

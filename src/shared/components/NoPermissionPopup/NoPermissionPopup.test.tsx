import userEvent from '@testing-library/user-event';
import { PreloadedState } from '@reduxjs/toolkit';

import { mockedAppletId } from 'shared/mock';
import { page } from 'resources';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { RootState } from 'redux/store';

import { NoPermissionPopup } from './NoPermissionPopup';

const mockedUseNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
  };
});

const getPreloadedState = (hasForbiddenError = true): PreloadedState<RootState> => ({
  forbiddenState: {
    data: {
      hasForbiddenError,
      redirectedFromBuilder: false,
    },
  },
});

describe('NoPermissionPopup', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render for a dashboard and submit', async () => {
    const route = `/dashboard/${mockedAppletId}/add-user`;
    const routePath = page.appletAddUser;
    const { getByTestId, queryByTestId, getByText } = renderWithProviders(<NoPermissionPopup />, {
      route,
      routePath,
      preloadedState: getPreloadedState(),
    });

    expect(getByTestId('no-permission-popup')).toBeVisible();
    expect(getByText('No access to applet')).toBeVisible();
    expect(getByText('To refresh the data, please click the button below.')).toBeVisible();

    await userEvent.click(getByText('Refresh'));

    expect(mockedUseNavigate).toBeCalledWith('/dashboard/applets');
    expect(queryByTestId('no-permission-popup')).not.toBeInTheDocument();
  });

  test('should render for a builder and submit', async () => {
    const route = `/builder/${mockedAppletId}/about`;
    const routePath = page.builderAppletAbout;
    const { getByTestId, queryByTestId, getByText } = renderWithProviders(<NoPermissionPopup />, {
      route,
      routePath,
      preloadedState: getPreloadedState(),
    });

    expect(getByTestId('no-permission-popup')).toBeVisible();
    expect(getByText('To refresh the data, please click the button below.')).toBeVisible();

    await userEvent.click(getByText('Go to Dashboard'));

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

  test('should not navigate to the dashboard applets page again if the user is currently on this page', async () => {
    const route = '/dashboard/applets';
    const routePath = page.dashboardApplets;
    const { queryByTestId, getByText } = renderWithProviders(<NoPermissionPopup />, {
      route,
      routePath,
      preloadedState: getPreloadedState(),
    });

    await userEvent.click(getByText('Refresh'));

    expect(mockedUseNavigate).not.toHaveBeenCalled();
    expect(queryByTestId('no-permission-popup')).not.toBeInTheDocument();
  });
});

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';
import { page } from 'resources';
import { mockedApplet, mockedAppletId, mockedCurrentWorkspace } from 'shared/mock';
import { initialStateData } from 'shared/state';
import { Roles } from 'shared/consts';
import { ErrorResponseType } from 'shared/types';

import { AppletNotFoundPopup } from './AppletNotFoundPopup';

const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [Roles.Manager],
      },
    },
    applet: mockedApplet,
    workspacesRoles: initialStateData,
  },
  applet: {
    applet: {
      ...initialStateData,
      error: [{ message: '', path: '', type: ErrorResponseType.NotFound }],
    },
  },
};

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('AppletNotFoundPopup', () => {
  test('should render for a dashboard and submit', () => {
    const route = `/dashboard/${mockedAppletId}/add-user`;
    const routePath = page.appletAddUser;
    renderWithProviders(<AppletNotFoundPopup />, { route, routePath, preloadedState });

    const popup = screen.getByTestId('applet-not-found-popup');
    expect(popup).toBeVisible();
    expect(
      screen.getByText(
        'Applet not found; it may have been deleted. To refresh the data, please click the button below.',
      ),
    ).toBeVisible();

    fireEvent.click(screen.getByText('Refresh'));

    expect(mockedUseNavigate).toBeCalledWith('/dashboard/applets');
  });

  test('should render for a builder and submit', () => {
    const route = `/builder/${mockedAppletId}/about`;
    const routePath = page.builderAppletAbout;
    renderWithProviders(<AppletNotFoundPopup />, { route, routePath, preloadedState });

    const popup = screen.getByTestId('applet-not-found-popup');
    expect(popup).toBeVisible();

    fireEvent.click(screen.getByText('Go to Dashboard'));

    expect(mockedUseNavigate).toBeCalledWith('/dashboard/applets');
  });

  test('shouldn\'t appear without not found error', () => {
    const route = `/builder/${mockedAppletId}/about`;
    const routePath = page.builderAppletAbout;
    renderWithProviders(<AppletNotFoundPopup />, {
      route,
      routePath,
      preloadedState: { ...preloadedState, applet: { applet: initialStateData } },
    });

    expect(screen.queryByTestId('applet-not-found-popup')).not.toBeInTheDocument();
  });
});

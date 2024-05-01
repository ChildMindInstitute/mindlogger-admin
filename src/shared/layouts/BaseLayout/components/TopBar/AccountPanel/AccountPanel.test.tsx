// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedUserData } from 'shared/mock';
import { auth, alerts } from 'redux/modules';
import * as reduxHooks from 'redux/store/hooks';
import * as hooksModule from 'shared/hooks';

import { AccountPanel } from './AccountPanel';

const mockDispatch = jest.fn();
const mockSetVisibleDrawer = jest.fn();
const mockHandleLogout = jest.fn();
const notWatched = 34;

jest.mock('shared/hooks', () => ({
  ...jest.requireActual('shared/hooks'),
  useLogout: jest.fn(),
}));

jest.mock('../Notifications', () => ({
  ...jest.requireActual('../Notifications'),
  Notifications: () => <div>Notifications</div>,
}));

jest.mock('redux/store/hooks', () => ({
  useAppDispatch: jest.fn(),
}));

describe('AccountPanel', () => {
  beforeEach(() => {
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    jest.spyOn(auth, 'useData').mockReturnValue({ user: mockedUserData });
    jest.spyOn(auth, 'useUserInitials').mockReturnValue('JD');
    jest.spyOn(alerts, 'useAlertsData').mockReturnValue({ notWatched });
  });

  test('renders user information and logout button', () => {
    renderWithProviders(<AccountPanel setVisibleDrawer={mockSetVisibleDrawer} visibleDrawer />);

    expect(screen.getByText('My account')).toBeInTheDocument();
    expect(screen.getByText(mockedUserData.email)).toBeInTheDocument();
    expect(screen.getByText(notWatched)).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  test('triggers logout when the logout button is clicked', async () => {
    jest.spyOn(hooksModule, 'useLogout').mockImplementation(() => mockHandleLogout);
    renderWithProviders(<AccountPanel setVisibleDrawer={mockSetVisibleDrawer} visibleDrawer />);

    const logoutButton = screen.getByText('Log out');
    await userEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockHandleLogout).toHaveBeenCalled();
    });
  });

  test('closes the drawer when the close button is clicked', async () => {
    renderWithProviders(<AccountPanel setVisibleDrawer={mockSetVisibleDrawer} visibleDrawer />);

    const closeButton = screen.getByTestId('account-panel-close');
    await userEvent.click(closeButton);

    expect(mockSetVisibleDrawer).toHaveBeenCalledWith(false);
  });

  test('closes the drawer when clicking outside', async () => {
    renderWithProviders(<AccountPanel setVisibleDrawer={mockSetVisibleDrawer} visibleDrawer />);

    await userEvent.click(document.body);

    expect(mockSetVisibleDrawer).toHaveBeenCalledWith(false);
  });
});

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

const mockDispatch = vi.fn();
const mockSetVisibleDrawer = vi.fn();
const mockHandleLogout = vi.fn();
const notWatched = 34;

vi.mock('shared/hooks', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useLogout: vi.fn(),
  };
});

vi.mock('../Notifications', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    Notifications: () => <div>Notifications</div>,
  };
});

vi.mock('redux/store/hooks', () => ({
  useAppDispatch: vi.fn(),
}));

describe('AccountPanel', () => {
  beforeEach(() => {
    vi.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    vi.spyOn(auth, 'useData').mockReturnValue({ user: mockedUserData });
    vi.spyOn(auth, 'useUserInitials').mockReturnValue('JD');
    vi.spyOn(alerts, 'useAlertsData').mockReturnValue({ notWatched });
  });

  test('renders user information and logout button', () => {
    renderWithProviders(<AccountPanel setVisibleDrawer={mockSetVisibleDrawer} visibleDrawer />);

    expect(screen.getByText('My account')).toBeInTheDocument();
    expect(screen.getByText(mockedUserData.email)).toBeInTheDocument();
    expect(screen.getByText(notWatched)).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  test('triggers logout when the logout button is clicked', async () => {
    vi.spyOn(hooksModule, 'useLogout').mockImplementation(() => mockHandleLogout);
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

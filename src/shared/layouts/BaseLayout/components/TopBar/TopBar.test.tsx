// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { TopBar } from './TopBar';

const getPreloadedState = ({ isAuthorized }) => ({
  auth: {
    isAuthorized,
    authentication: {
      data: isAuthorized
        ? {
            user: {
              email: 'janedoe@gmail.com',
              firstName: 'Jane',
              lastName: 'Doe',
              id: '6d195670-726d-4c36-8682-c9f2615827dd',
            },
          }
        : null,
    },
  },
  alerts: {
    alerts: {
      data: isAuthorized ? { notWatched: 23 } : null,
    },
  },
});

const dataTestid = 'top-bar';
const mockedUseNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
  };
});

vi.mock('./Notifications', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    Notifications: () => <div>Notifications</div>,
  };
});

describe('TopBar component', () => {
  test('when isAuthorized = false', async () => {
    const preloadedState = getPreloadedState({ isAuthorized: false });
    renderWithProviders(<TopBar />, { preloadedState });

    const loginButton = screen.getByTestId(`${dataTestid}-login-button`);
    expect(loginButton).toBeInTheDocument();

    await userEvent.click(loginButton);

    expect(mockedUseNavigate).toBeCalledWith('/auth');
  });

  test('when isAuthorized = true', async () => {
    const preloadedState = getPreloadedState({ isAuthorized: true });
    renderWithProviders(<TopBar />, { preloadedState });

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
    const badge = screen.getByTestId(`${dataTestid}-badge`);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(23);

    expect(screen.queryByTestId('account-panel')).not.toBeInTheDocument();

    const badgeButton = screen.getByTestId(`${dataTestid}-badge-button`);
    await userEvent.click(badgeButton);

    expect(screen.getByTestId('account-panel')).toBeInTheDocument();
  });
});

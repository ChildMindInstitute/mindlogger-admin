import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { page } from 'resources';

import { RecoverPassword } from './RecoverPassword';
import { recoveryPasswordDataTestid } from './RecoverPassword.const';

const mockKey = 'key';
const mockEmail = 'jdoe@test.com';
const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

describe('RecoverPassword', () => {
  test('test navigate to reset password when request fails', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('Error'));
    renderWithProviders(<RecoverPassword />, {
      route: `/auth/password-recovery?key=${mockKey}&email=${mockEmail}`,
      routePath: page.passwordRecovery,
    });

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    expect(mockAxios.get).nthCalledWith(1, '/users/me/password/recover/healthcheck', {
      params: {
        email: mockEmail,
        key: mockKey,
      },
      signal: undefined,
    });

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    const description = screen.getByTestId(`${recoveryPasswordDataTestid}-description`);
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent(
      'This link is invalid or expired. Please click here to reset your password.',
    );

    const link = screen.getByTestId(`${recoveryPasswordDataTestid}-link`);
    expect(link).toBeInTheDocument();
    await userEvent.click(link);

    expect(mockUseNavigate).toHaveBeenCalledWith('/auth/reset-password');
  });

  test('render recover form when request is successful', async () => {
    mockAxios.get.mockResolvedValue({});
    renderWithProviders(<RecoverPassword />, {
      route: `/auth/password-recovery?key=${mockKey}&email=${mockEmail}`,
      routePath: page.passwordRecovery,
    });

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    expect(mockAxios.get).nthCalledWith(1, '/users/me/password/recover/healthcheck', {
      params: {
        email: mockEmail,
        key: mockKey,
      },
      signal: undefined,
    });

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    const recoverForm = screen.getByTestId('recover-password-form');
    expect(recoverForm).toBeInTheDocument();
  });
});

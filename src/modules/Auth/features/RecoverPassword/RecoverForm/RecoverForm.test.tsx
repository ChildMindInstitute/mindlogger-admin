import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { LocationStateKeys } from 'shared/types';

import { RecoverForm } from './RecoverForm';
import { recoverPasswordFormDataTestid } from './RecoverForm.const';

const mockKey = 'key';
const mockEmail = 'jdoe@test.com';
const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

describe('RecoverForm', () => {
  test('test email inputs (with error), test success request', async () => {
    mockAxios.post.mockResolvedValueOnce({ data: {} });

    renderWithProviders(<RecoverForm email={mockEmail} resetKey={mockKey} />);

    const container = screen.getByTestId(recoverPasswordFormDataTestid);
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Create New Password')).toBeInTheDocument(); // title
    expect(screen.getByText(`Create a new password for ${mockEmail}`)).toBeInTheDocument(); // description

    const password = screen.getByTestId(`${recoverPasswordFormDataTestid}-password`);
    const confirmPassword = screen.getByTestId(`${recoverPasswordFormDataTestid}-confirm-password`);

    expect(password).toBeInTheDocument();
    expect(confirmPassword).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/New password/i), 'test1');
    await userEvent.type(screen.getByLabelText(/Confirm password/i), 'test2');

    const submitButton = screen.getByTestId(`${recoverPasswordFormDataTestid}-submit`);
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('Submit');

    await userEvent.click(submitButton);

    const passwordError = password.querySelector('.MuiFormHelperText-root.Mui-error');
    expect(passwordError).toBeInTheDocument();
    expect(passwordError).toHaveTextContent('Password must be at least 6 characters.');

    const confirmPasswordError = confirmPassword.querySelector('.MuiFormHelperText-root.Mui-error');
    expect(confirmPasswordError).toBeInTheDocument();
    expect(confirmPasswordError).toHaveTextContent('Your passwords do not match');

    await userEvent.clear(screen.getByLabelText(/New password/i));
    await userEvent.clear(screen.getByLabelText(/Confirm password/i));

    await userEvent.type(screen.getByLabelText(/New password/i), 'New_Password');
    await userEvent.type(screen.getByLabelText(/Confirm password/i), 'New_Password');

    await userEvent.click(submitButton);

    expect(mockAxios.post).toBeCalledWith(
      '/users/me/password/recover/approve',
      { email: mockEmail, key: mockKey, password: 'New_Password' },
      { signal: undefined },
    );

    expect(mockUseNavigate).toHaveBeenCalledWith('/auth', {
      state: { [LocationStateKeys.IsPasswordReset]: true },
    });
  });

  test('test error request', async () => {
    mockAxios.post.mockRejectedValue(new Error('Mock error'));

    renderWithProviders(<RecoverForm email={mockEmail} resetKey={mockKey} />);

    const password = screen.getByTestId(`${recoverPasswordFormDataTestid}-password`);
    const confirmPassword = screen.getByTestId(`${recoverPasswordFormDataTestid}-confirm-password`);

    expect(password).toBeInTheDocument();
    expect(confirmPassword).toBeInTheDocument();

    const submitButton = screen.getByTestId(`${recoverPasswordFormDataTestid}-submit`);
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('Submit');

    await userEvent.type(screen.getByLabelText(/New password/i), 'New_Password');
    await userEvent.type(screen.getByLabelText(/Confirm password/i), 'New_Password');

    await userEvent.click(submitButton);

    expect(mockAxios.post).toBeCalledWith(
      '/users/me/password/recover/approve',
      { email: mockEmail, key: mockKey, password: 'New_Password' },
      { signal: undefined },
    );

    const error = screen.getByTestId(`${recoverPasswordFormDataTestid}-error`);
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent('Mock error');
  });
});

import { fireEvent, waitFor, screen } from '@testing-library/react';

import { inputAcceptsValue } from 'shared/tests/inputAcceptsValue';
import { renderComponentForEachTest } from 'shared/utils/renderComponentForEachTest';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { RootState } from 'redux/store';
import { mockedEmail } from 'shared/mock';

import { ResetForm } from '.';

const mockedResetPasswordApi = vi.hoisted(() => vi.fn());

vi.mock('api', async () => ({
  ...(await vi.importActual('api')),
  resetPasswordApi: mockedResetPasswordApi,
}));

const submitForm = (email: string) => {
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: email } });
  fireEvent.click(screen.getByTestId('reset-form-reset'));
};

describe('ResetForm component tests', () => {
  renderComponentForEachTest(<ResetForm />);

  test('ResetForm inputs should accept values', () => {
    inputAcceptsValue('Email', mockedEmail);
  });

  test('should be able to validate ResetForm form', async () => {
    submitForm('test');
    await waitFor(() => expect(screen.getByText('Email must be valid')).toBeInTheDocument());

    submitForm('');
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
  });
});

// Rendered per test here rather than through renderComponentForEachTest, which cannot preload state.
describe('ResetForm while a session is running in another tab', () => {
  const sessionElsewhereState = {
    auth: { hasSessionElsewhere: true },
  } as Pick<RootState, 'auth'>;

  beforeEach(() => mockedResetPasswordApi.mockClear());

  // No session is started here, but a tab that is not in the live one does not act on its own.
  test('pressing send reset link neither sends nor leaves the button usable', async () => {
    renderWithProviders(<ResetForm />, { preloadedState: sessionElsewhereState });

    submitForm(mockedEmail);

    await waitFor(() => expect(screen.getByTestId('reset-form-reset')).toBeDisabled());
    expect(mockedResetPasswordApi).not.toHaveBeenCalled();
  });

  // The guard sits ahead of validation, so an empty form is turned away rather than told off.
  test('submitting an empty form is turned away rather than validated', async () => {
    renderWithProviders(<ResetForm />, { preloadedState: sessionElsewhereState });

    fireEvent.submit(screen.getByTestId('reset-form-reset').closest('form') as HTMLFormElement);

    await waitFor(() => expect(screen.getByTestId('reset-form-reset')).toBeDisabled());
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
  });

  test('the button is usable until it is pressed', () => {
    renderWithProviders(<ResetForm />, { preloadedState: sessionElsewhereState });

    expect(screen.getByTestId('reset-form-reset')).toBeEnabled();
  });

  test('sends the reset link as usual when no other session is running', async () => {
    mockedResetPasswordApi.mockResolvedValue({ data: {} });
    renderWithProviders(<ResetForm />);

    submitForm(mockedEmail);

    await waitFor(() => expect(mockedResetPasswordApi).toHaveBeenCalledTimes(1));
  });
});

import { fireEvent, waitFor, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { inputAcceptsValue } from 'shared/tests/inputAcceptsValue';
import { mockedEmail, mockedPassword } from 'shared/mock';
import { Mixpanel, MixpanelEventType, MixpanelProps } from 'shared/utils/mixpanel';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { expectBanner } from 'shared/utils';
import { RootState } from 'redux/store';
import { page } from 'resources';

import { LoginForm } from '.';

const mockedSignInApi = vi.hoisted(() => vi.fn());
const mockedNavigate = vi.hoisted(() => vi.fn());

vi.mock('api', async () => ({
  ...(await vi.importActual('api')),
  signInApi: mockedSignInApi,
}));

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockedNavigate,
}));

const submitForm = (username: string, password: string) => {
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: username } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: password } });
  fireEvent.click(screen.getByTestId('login-form-signin'));
};

const preloadedState = {
  auth: {
    softLockData: {
      email: mockedEmail,
    },
  },
} as Pick<RootState, 'auth'>;

const sessionElsewhereState = {
  auth: {
    hasSessionElsewhere: true,
  },
} as Pick<RootState, 'auth'>;

describe('Login component tests', () => {
  beforeEach(() => mockedNavigate.mockClear());

  test('login inputs should accept values', () => {
    renderWithProviders(<LoginForm />);
    inputAcceptsValue('Email', mockedEmail);
    inputAcceptsValue('Password', mockedPassword);
  });

  test('should be able to validate login form', async () => {
    renderWithProviders(<LoginForm />);
    submitForm('test', mockedPassword);
    await waitFor(() => expect(screen.getByText('Email must be valid')).toBeInTheDocument());

    submitForm('', '');
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Password is required')).toBeInTheDocument());
  });

  test('should display soft-lock state', async () => {
    const { store } = renderWithProviders(<LoginForm />, { preloadedState });

    await waitFor(() => expectBanner(store, 'SoftLockWarningBanner'));

    expect(screen.getByLabelText('Email')).toHaveValue(mockedEmail);
  });

  describe('while a session is running in another tab', () => {
    beforeEach(() => mockedSignInApi.mockClear());

    test('pressing sign in neither signs in nor leaves the button usable', async () => {
      renderWithProviders(<LoginForm />, { preloadedState: sessionElsewhereState });

      submitForm(mockedEmail, mockedPassword);

      await waitFor(() => expect(screen.getByTestId('login-form-signin')).toBeDisabled());
      expect(mockedSignInApi).not.toHaveBeenCalled();
    });

    // The form submits on Enter alone, so the guard cannot live on the button.
    test('pressing enter in the password field is turned away too', async () => {
      renderWithProviders(<LoginForm />, { preloadedState: sessionElsewhereState });

      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: mockedEmail } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: mockedPassword } });
      fireEvent.submit(screen.getByTestId('login-form-signin').closest('form') as HTMLFormElement);

      await waitFor(() => expect(screen.getByTestId('login-form-signin')).toBeDisabled());
      expect(mockedSignInApi).not.toHaveBeenCalled();
    });

    // Nothing looks broken on arrival: it is pressing it that shows there is no way through here.
    test('the button is usable until it is pressed', () => {
      renderWithProviders(<LoginForm />, { preloadedState: sessionElsewhereState });

      expect(screen.getByTestId('login-form-signin')).toBeEnabled();
      expect(screen.getByTestId('login-form-signup')).toBeEnabled();
      expect(screen.getByTestId('login-form-forgot-password')).toBeEnabled();
    });

    // Signing up ends in a sign-in, so this is the same second session by another door.
    test('pressing create account does not reach the sign-up page', async () => {
      renderWithProviders(<LoginForm />, { preloadedState: sessionElsewhereState });

      fireEvent.click(screen.getByTestId('login-form-signup'));

      await waitFor(() => expect(screen.getByTestId('login-form-signup')).toBeDisabled());
      expect(mockedNavigate).not.toHaveBeenCalled();
    });

    test('pressing forgot password does not reach the reset page', async () => {
      renderWithProviders(<LoginForm />, { preloadedState: sessionElsewhereState });

      fireEvent.click(screen.getByTestId('login-form-forgot-password'));

      await waitFor(() => expect(screen.getByTestId('login-form-forgot-password')).toBeDisabled());
      expect(mockedNavigate).not.toHaveBeenCalled();
    });

    // The page is stale, not just one control on it.
    test('one refusal quiets every way off this page', async () => {
      renderWithProviders(<LoginForm />, { preloadedState: sessionElsewhereState });

      fireEvent.click(screen.getByTestId('login-form-signup'));

      await waitFor(() => expect(screen.getByTestId('login-form-signin')).toBeDisabled());
      expect(screen.getByTestId('login-form-forgot-password')).toBeDisabled();
    });
  });

  test('create account and forgot password work as usual with no other session', () => {
    renderWithProviders(<LoginForm />);

    fireEvent.click(screen.getByTestId('login-form-signup'));
    expect(mockedNavigate).toHaveBeenCalledWith(page.signUp);

    fireEvent.click(screen.getByTestId('login-form-forgot-password'));
    expect(mockedNavigate).toHaveBeenCalledWith(page.passwordReset);
  });

  test('signs in as usual when no other session is running', async () => {
    mockedSignInApi.mockClear();
    mockedSignInApi.mockRejectedValue(new Error('no server in tests'));
    renderWithProviders(<LoginForm />);

    submitForm(mockedEmail, mockedPassword);

    await waitFor(() => expect(mockedSignInApi).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('login-form-signin')).toBeEnabled();
  });

  describe('Mixpanel Tracking', () => {
    beforeEach(() => {
      vi.mocked(Mixpanel.track).mockClear();
    });

    test('should have Mixpanel mock set up correctly', () => {
      // Verify the mock is configured properly for other tests
      expect(Mixpanel.track).toBeDefined();
      expect(vi.isMockFunction(Mixpanel.track)).toBe(true);
    });

    test('should export correct MixpanelEventType values for LoginForm tracking', () => {
      // Verify the event types used by LoginForm are available
      expect(MixpanelEventType.MFAChallengePresented).toBe('MFA Challenge Presented');
      expect(MixpanelEventType.LoginSuccessful).toBe('Login Successful');
      expect(MixpanelEventType.LoginFailed).toBe('Login Failed');
    });

    test('should export correct MixpanelProps for LoginForm tracking', () => {
      // Verify the props used by LoginForm are available
      expect(MixpanelProps.MFAUsed).toBe('MFA Used');
      expect(MixpanelProps.MFAMethodUsed).toBe('MFA Method Used');
      expect(MixpanelProps.FailureStage).toBe('Failure Stage');
    });
  });
});

import { fireEvent, waitFor, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { inputAcceptsValue } from 'shared/tests/inputAcceptsValue';
import { mockedEmail, mockedPassword } from 'shared/mock';
import { Mixpanel, MixpanelEventType, MixpanelProps } from 'shared/utils/mixpanel';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { expectBanner } from 'shared/utils';
import { RootState } from 'redux/store';

import { LoginForm } from '.';

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

describe('Login component tests', () => {
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

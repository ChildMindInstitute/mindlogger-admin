import { AuthSchema } from 'modules/Auth/state/Auth.schema';
import { initialStateData } from 'shared/state';

/**
 * Creates a minimal auth state for tests that includes the required MFA verification properties
 */
export const createTestAuthState = (overrides?: Partial<AuthSchema>): AuthSchema => ({
  authentication: initialStateData,
  isAuthorized: false,
  isLogoutInProgress: false,
  totpVerification: { status: 'idle' },
  recoveryVerification: { status: 'idle' },
  isSessionExpired: false,
  ...overrides,
});

/**
 * Creates an authorized auth state for tests
 */
export const createAuthorizedAuthState = (
  userData: { id: string; email: string; firstName: string; lastName: string },
  overrides?: Partial<AuthSchema>,
): AuthSchema => ({
  authentication: {
    ...initialStateData,
    status: 'success',
    data: { user: userData },
  },
  isAuthorized: true,
  isLogoutInProgress: false,
  totpVerification: { status: 'idle' },
  recoveryVerification: { status: 'idle' },
  isSessionExpired: false,
  ...overrides,
});

/**
 * Default MFA verification state for tests
 */
export const defaultMFAVerificationState = { status: 'idle' as const };

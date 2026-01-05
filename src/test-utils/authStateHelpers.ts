import { AuthSchema } from 'modules/Auth/state/Auth.schema';
import { initialStateData } from 'shared/state';

/**
 * Creates a minimal auth state for tests that includes the required mfaVerification property
 */
export const createTestAuthState = (overrides?: Partial<AuthSchema>): AuthSchema => ({
  authentication: initialStateData,
  isAuthorized: false,
  isLogoutInProgress: false,
  mfaVerification: { status: 'idle' },
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
  mfaVerification: { status: 'idle' },
  ...overrides,
});

/**
 * Default MFA verification state for tests
 */
export const defaultMFAVerificationState = { status: 'idle' as const };

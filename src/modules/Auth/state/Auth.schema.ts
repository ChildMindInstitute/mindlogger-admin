import { Workspace } from 'redux/modules';
import { BaseSchema } from 'shared/state/Base';

export type User = {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  mfaEnabled?: boolean;
};

export type AuthData = {
  user: User;
};

export type SoftLockData = {
  email?: string;
  redirectTo: string;
  workspace: Workspace | null;
};

// MFA Session data stored in Redux - only contains backend-provided tokens
// Session expiry and attempts are tracked by the backend
export type MFASession = {
  token: string;
  sessionId: string;
};

// MFA Verification state - separate for TOTP and Recovery
export type MFAVerificationState = {
  status: 'idle' | 'loading' | 'error';
  displayError?: string;
  attemptsRemaining?: number | null;
};

export type AuthSchema = {
  authentication: BaseSchema<AuthData | null>;
  isAuthorized: boolean;
  isLogoutInProgress: boolean;
  softLockData?: SoftLockData;
  mfaSession?: MFASession;
  totpVerification: MFAVerificationState; // TOTP-specific errors
  recoveryVerification: MFAVerificationState; // Recovery-specific errors
  isSessionExpired: boolean; // Shared terminal state
};

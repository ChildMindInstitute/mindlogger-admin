import { Workspace } from 'redux/modules';
import { BaseSchema } from 'shared/state/Base';

export type User = {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
};

export type AuthData = {
  user: User;
};

export type SoftLockData = {
  email?: string;
  redirectTo: string;
  workspace: Workspace | null;
};

// MFA Session data stored in Redux
export type MFASession = {
  token: string;
  sessionId: string;
  attempts: number;
  expiresAt: number;
};

export type AuthSchema = {
  authentication: BaseSchema<AuthData | null>;
  isAuthorized: boolean;
  isLogoutInProgress: boolean;
  softLockData?: SoftLockData;
  mfaSession?: MFASession;
};

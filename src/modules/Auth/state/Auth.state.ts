import { initialStateData } from 'shared/state';

import { AuthSchema, MFAVerificationState } from './Auth.schema';

const initialVerificationState: MFAVerificationState = {
  status: 'idle',
};

export const state: AuthSchema = {
  authentication: initialStateData,
  isAuthorized: false,
  isLogoutInProgress: false,
  totpVerification: initialVerificationState,
  recoveryVerification: initialVerificationState,
  isSessionExpired: false,
};

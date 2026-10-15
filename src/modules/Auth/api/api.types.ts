export type SignIn = { email: string; password: string };

export type SignUpArgs = {
  body: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
};

export type ResetPassword = { email: string };

export type RecoverPasswordHealthCheck = { email: string | null; key: string | null };

export type ApproveRecoveryPassword = { email: string; key: string; password: string };

// MFA Types
export type TokenData = {
  accessToken: string;
  refreshToken: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

// Standard login response (when MFA is disabled)
export type StandardLoginResponse = {
  result: {
    token: TokenData;
    user: User;
  };
};

// MFA verification responses can also return error messages without tokens
export type MFAVerifySuccessResponse = StandardLoginResponse;
export type MFAVerifyErrorResponse = {
  message?: string;
  result?: {
    message?: string;
  };
};

// MFA required response (when MFA is enabled)
export type MFARequiredResponse = {
  result: {
    mfaRequired: true;
    mfaSessionId: string;
    mfaToken: string;
  };
};

// MSA required response (admin user must accept the MSA before getting tokens)
export type MSARequiredResponse = {
  result: {
    msaRequired: true;
    msaToken: string;
    version: string;
    userId: string;
    userEmail: string;
    // Set when the user's grace period has ended
    deadline: string | null;
  };
};

// Combined login response type
export type LoginResponse = StandardLoginResponse | MFARequiredResponse | MSARequiredResponse;

// MFA verification requests
export type MFATOTPVerifyRequest = {
  mfaToken: string;
  totpCode: string;
  deviceId?: string;
};

export type MFARecoveryCodeVerifyRequest = {
  mfaToken: string;
  code: string;
  deviceId?: string;
};

// MFA verification response (same as standard login response)
export type MFAVerifyResponse =
  | MFAVerifySuccessResponse
  | MSARequiredResponse
  | MFAVerifyErrorResponse;

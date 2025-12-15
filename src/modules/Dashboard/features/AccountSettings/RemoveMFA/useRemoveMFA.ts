import { useState } from 'react';
import { AxiosError } from 'axios';

import { mfaApi } from 'shared/api';

interface ErrorResponse {
  result?: Array<{
    message?: string;
  }>;
}

const MFA_DISABLE_ERROR_MESSAGES = {
  NOT_ENABLED: 'Two-factor authentication is not enabled on this account.',
  INVALID_CODE: 'Invalid verification code. Please check your authenticator app and try again.',
  RECOVERY_CODE_INVALID: 'Invalid recovery code. Please check the code and try again.',
  RECOVERY_CODE_USED: 'This recovery code has already been used. Each code can only be used once.',
  EXPIRED_SESSION: 'Your verification session has expired. Please start over.',
  MAX_ATTEMPTS: 'Too many invalid attempts. Please try again later.',
  GLOBAL_LOCKOUT:
    'Account temporarily locked due to multiple failed attempts. Please try again later.',
  SESSION_MISMATCH: 'Invalid verification session. Please start over.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Exact backend error message patterns
const BACKEND_ERROR_PATTERNS = {
  NOT_ENABLED: /MFA is not enabled/i,
  INVALID_TOTP: /Invalid TOTP code/i,
  RECOVERY_INVALID: /Invalid recovery code/i,
  RECOVERY_USED: /recovery code has already been used/i,
  RECOVERY_NOT_FOUND: /No matching recovery code found|recovery code.*not found/i,
  SESSION_NOT_FOUND: /MFA session not found or expired/i,
  SESSION_EXPIRED: /expired/i,
  TOO_MANY_ATTEMPTS: /Too many invalid TOTP attempts/i,
  GLOBAL_LOCKOUT: /Account temporarily locked due to multiple failed MFA attempts/i,
  SESSION_MISMATCH: /Invalid MFA session for this operation/i,
};

const getErrorMessage = (error: AxiosError): string => {
  const responseData = error.response?.data as ErrorResponse | undefined;
  const backendMessage = responseData?.result?.[0]?.message || '';
  const statusCode = error.response?.status;

  // Check for specific backend error messages first
  if (BACKEND_ERROR_PATTERNS.NOT_ENABLED.test(backendMessage)) {
    return MFA_DISABLE_ERROR_MESSAGES.NOT_ENABLED;
  }
  if (BACKEND_ERROR_PATTERNS.RECOVERY_USED.test(backendMessage)) {
    return MFA_DISABLE_ERROR_MESSAGES.RECOVERY_CODE_USED;
  }
  if (
    BACKEND_ERROR_PATTERNS.RECOVERY_INVALID.test(backendMessage) ||
    BACKEND_ERROR_PATTERNS.RECOVERY_NOT_FOUND.test(backendMessage)
  ) {
    return MFA_DISABLE_ERROR_MESSAGES.RECOVERY_CODE_INVALID;
  }
  if (BACKEND_ERROR_PATTERNS.GLOBAL_LOCKOUT.test(backendMessage)) {
    return MFA_DISABLE_ERROR_MESSAGES.GLOBAL_LOCKOUT;
  }
  if (BACKEND_ERROR_PATTERNS.TOO_MANY_ATTEMPTS.test(backendMessage)) {
    return MFA_DISABLE_ERROR_MESSAGES.MAX_ATTEMPTS;
  }
  if (BACKEND_ERROR_PATTERNS.SESSION_NOT_FOUND.test(backendMessage)) {
    return MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION;
  }
  if (BACKEND_ERROR_PATTERNS.SESSION_MISMATCH.test(backendMessage)) {
    return MFA_DISABLE_ERROR_MESSAGES.SESSION_MISMATCH;
  }
  if (BACKEND_ERROR_PATTERNS.INVALID_TOTP.test(backendMessage)) {
    return MFA_DISABLE_ERROR_MESSAGES.INVALID_CODE;
  }

  // Fallback to status code-based error messages
  if (statusCode === 401) {
    // 401 - Invalid TOTP/recovery code or expired session
    if (BACKEND_ERROR_PATTERNS.SESSION_EXPIRED.test(backendMessage)) {
      return MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION;
    }

    return MFA_DISABLE_ERROR_MESSAGES.INVALID_CODE;
  }
  if (statusCode === 403) {
    // 403 - MFA not enabled or access denied
    return MFA_DISABLE_ERROR_MESSAGES.NOT_ENABLED;
  }
  if (statusCode === 404) {
    // 404 - Session not found
    return MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION;
  }
  if (statusCode === 429) {
    // 429 - Too many attempts or global lockout
    return MFA_DISABLE_ERROR_MESSAGES.GLOBAL_LOCKOUT;
  }

  // Network errors
  if (error.code === 'ERR_NETWORK' || !error.response) {
    return MFA_DISABLE_ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Log unexpected errors for debugging
  console.error('Unexpected MFA disable error:', {
    status: statusCode,
    message: backendMessage,
    error,
  });

  return MFA_DISABLE_ERROR_MESSAGES.UNKNOWN_ERROR;
};

interface VerifyResult {
  success: boolean;
}

export const useRemoveMFA = () => {
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const initiateDisable = async (): Promise<{ success: boolean; mfaToken?: string }> => {
    setIsLoading(true);
    clearError();

    try {
      const response = await mfaApi.initiateDisable();
      const token = response.data.result.mfaToken;
      setMfaToken(token);
      setIsLoading(false);

      return { success: true, mfaToken: token };
    } catch (err) {
      const errorMessage = getErrorMessage(err as AxiosError);
      setError(errorMessage);
      setIsLoading(false);

      return { success: false };
    }
  };

  const verifyAndDisable = async (code: string): Promise<VerifyResult> => {
    if (!mfaToken) {
      setError(MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION);

      return { success: false };
    }

    setIsLoading(true);
    clearError();

    try {
      await mfaApi.verifyAndDisable({
        mfaToken,
        code,
      });

      setIsLoading(false);

      return { success: true };
    } catch (err) {
      const errorMessage = getErrorMessage(err as AxiosError);
      setError(errorMessage);
      setIsLoading(false);

      return { success: false };
    }
  };

  return {
    mfaToken,
    isLoading,
    error,
    clearError,
    initiateDisable,
    verifyAndDisable,
  };
};

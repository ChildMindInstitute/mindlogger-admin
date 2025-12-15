import { AxiosError } from 'axios';

import {
  MFA_DISABLE_ERROR_MESSAGES,
  BACKEND_ERROR_PATTERNS,
  MFA_DISABLE_STATUS_CODES,
} from './RemoveMFA.constants';

/**
 * Error response structure from backend
 */
export interface ErrorResponse {
  result?: Array<{
    message?: string;
  }>;
}

/**
 * Maps backend error responses to user-friendly error messages
 * @param error - Axios error from MFA disable API call
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: AxiosError): string => {
  const responseData = error.response?.data as ErrorResponse | undefined;
  const backendMessage = responseData?.result?.[0]?.message || '';
  const statusCode = error.response?.status;

  // Check for specific backend error messages first (most accurate)
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
  switch (statusCode) {
    case MFA_DISABLE_STATUS_CODES.UNAUTHORIZED:
      // 401 - Invalid TOTP/recovery code or expired session
      if (BACKEND_ERROR_PATTERNS.SESSION_EXPIRED.test(backendMessage)) {
        return MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION;
      }

      return MFA_DISABLE_ERROR_MESSAGES.INVALID_CODE;

    case MFA_DISABLE_STATUS_CODES.FORBIDDEN:
      // 403 - MFA not enabled or access denied
      return MFA_DISABLE_ERROR_MESSAGES.NOT_ENABLED;

    case MFA_DISABLE_STATUS_CODES.NOT_FOUND:
      // 404 - Session not found
      return MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION;

    case MFA_DISABLE_STATUS_CODES.TOO_MANY_REQUESTS:
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

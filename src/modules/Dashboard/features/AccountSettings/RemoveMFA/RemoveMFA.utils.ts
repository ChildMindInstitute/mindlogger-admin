import { AxiosError } from 'axios';

import {
  MFA_DISABLE_ERROR_MESSAGES,
  BACKEND_ERROR_PATTERNS,
  MFA_DISABLE_STATUS_CODES,
} from './RemoveMFA.constants';
import { ErrorScenario, ErrorMetadata, ErrorResponse } from './RemoveMFA.types';

interface ParsedError {
  message: string;
  scenario: ErrorScenario;
  metadata?: ErrorMetadata;
}

/**
 * Maps backend error responses to user-friendly error messages
 * Extracts metadata for attempt tracking (same pattern as ViewRecoveryCodes)
 * @param error - Axios error from MFA disable API call
 * @param codeType - Type of code being verified ('totp' or 'recovery')
 * @returns Parsed error with message, scenario, and metadata
 */
export const parseError = (error: AxiosError, codeType?: 'totp' | 'recovery'): ParsedError => {
  const responseData = error.response?.data as ErrorResponse | undefined;
  const backendMessage = responseData?.result?.[0]?.message || '';
  const metadata = responseData?.metadata;
  const errorCode = responseData?.error_code || '';
  const statusCode = error.response?.status;

  // Global lockout - check this FIRST before other checks
  if (
    errorCode === 'AUTH.MFA.GLOBAL_LOCKOUT' ||
    metadata?.global_attempts_remaining === 0 ||
    (statusCode === MFA_DISABLE_STATUS_CODES.TOO_MANY_REQUESTS && metadata?.lockout_expires_at)
  ) {
    return {
      message: MFA_DISABLE_ERROR_MESSAGES.GLOBAL_LOCKOUT,
      scenario: ErrorScenario.GLOBAL_LOCKOUT,
      metadata,
    };
  }

  // Check if no session attempts remaining - prevents 6th attempt
  if (metadata?.session_attempts_remaining === 0) {
    return {
      message: MFA_DISABLE_ERROR_MESSAGES.MAX_ATTEMPTS,
      scenario: ErrorScenario.MAX_SESSION_ATTEMPTS,
      metadata,
    };
  }

  // Max session attempts
  if (
    statusCode === MFA_DISABLE_STATUS_CODES.TOO_MANY_REQUESTS &&
    BACKEND_ERROR_PATTERNS.TOO_MANY_ATTEMPTS.test(backendMessage)
  ) {
    return {
      message: MFA_DISABLE_ERROR_MESSAGES.MAX_ATTEMPTS,
      scenario: ErrorScenario.MAX_SESSION_ATTEMPTS,
      metadata,
    };
  }

  // Session expired or not found
  if (
    statusCode === MFA_DISABLE_STATUS_CODES.UNAUTHORIZED &&
    (BACKEND_ERROR_PATTERNS.SESSION_NOT_FOUND.test(backendMessage) ||
      errorCode === 'AUTH.MFA.SESSION_NOT_FOUND' ||
      errorCode === 'AUTH.MFA.TOKEN_EXPIRED')
  ) {
    return {
      message: MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION,
      scenario: ErrorScenario.SESSION_EXPIRED,
      metadata,
    };
  }

  // Invalid TOTP code
  if (
    statusCode === MFA_DISABLE_STATUS_CODES.UNAUTHORIZED &&
    BACKEND_ERROR_PATTERNS.INVALID_TOTP.test(backendMessage)
  ) {
    return {
      message: MFA_DISABLE_ERROR_MESSAGES.INVALID_CODE,
      scenario: ErrorScenario.INVALID_CODE,
      metadata,
    };
  }

  // Recovery code specific errors
  if (BACKEND_ERROR_PATTERNS.RECOVERY_USED.test(backendMessage)) {
    return {
      message: MFA_DISABLE_ERROR_MESSAGES.RECOVERY_CODE_USED,
      scenario: ErrorScenario.INVALID_CODE,
      metadata,
    };
  }

  if (
    BACKEND_ERROR_PATTERNS.RECOVERY_INVALID.test(backendMessage) ||
    BACKEND_ERROR_PATTERNS.RECOVERY_NOT_FOUND.test(backendMessage)
  ) {
    return {
      message: MFA_DISABLE_ERROR_MESSAGES.RECOVERY_CODE_INVALID,
      scenario: ErrorScenario.INVALID_CODE,
      metadata,
    };
  }

  // MFA not enabled
  if (
    statusCode === MFA_DISABLE_STATUS_CODES.FORBIDDEN ||
    BACKEND_ERROR_PATTERNS.NOT_ENABLED.test(backendMessage)
  ) {
    return {
      message: MFA_DISABLE_ERROR_MESSAGES.NOT_ENABLED,
      scenario: ErrorScenario.GENERIC,
      metadata,
    };
  }

  // Session mismatch
  if (BACKEND_ERROR_PATTERNS.SESSION_MISMATCH.test(backendMessage)) {
    return {
      message: MFA_DISABLE_ERROR_MESSAGES.SESSION_MISMATCH,
      scenario: ErrorScenario.GENERIC,
      metadata,
    };
  }

  // Network errors
  if (error.code === 'ERR_NETWORK' || !error.response) {
    return {
      message: MFA_DISABLE_ERROR_MESSAGES.NETWORK_ERROR,
      scenario: ErrorScenario.GENERIC,
    };
  }

  // Fallback for 401 - likely invalid code, differentiate based on codeType
  if (statusCode === MFA_DISABLE_STATUS_CODES.UNAUTHORIZED) {
    if (codeType === 'recovery') {
      return {
        message: MFA_DISABLE_ERROR_MESSAGES.RECOVERY_CODE_INVALID,
        scenario: ErrorScenario.INVALID_CODE,
        metadata,
      };
    }

    return {
      message: MFA_DISABLE_ERROR_MESSAGES.INVALID_CODE,
      scenario: ErrorScenario.INVALID_CODE,
      metadata,
    };
  }

  // Default
  console.error('Unexpected MFA disable error:', {
    status: statusCode,
    message: backendMessage,
    error,
  });

  return {
    message: backendMessage || MFA_DISABLE_ERROR_MESSAGES.UNKNOWN_ERROR,
    scenario: ErrorScenario.GENERIC,
    metadata,
  };
};

/**
 * Legacy wrapper for backward compatibility
 * Returns just the error message string
 */
export const getErrorMessage = (error: AxiosError): string => parseError(error).message;

import { AxiosError } from 'axios';

import { ErrorScenario, ErrorMetadata, ErrorResponse } from './ViewRecoveryCodes.types';

interface ParsedError {
  message: string;
  scenario: ErrorScenario;
  metadata?: ErrorMetadata;
}

const BACKEND_ERROR_PATTERNS = {
  INVALID_TOTP: /invalid.*(totp|verification|authentication).*code/i,
  INVALID_RECOVERY: /invalid.*recovery.*code/i,
  TOO_MANY_ATTEMPTS: /too many.*invalid.*attempts/i,
  SESSION_NOT_FOUND: /mfa.*session.*(not found|expired)/i,
  MFA_NOT_ENABLED: /mfa.*(not enabled|disabled)/i,
  NO_RECOVERY_CODES: /no.*recovery.*codes/i,
};

const STATUS_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
};

const ERROR_MESSAGES = {
  INVALID_CODE: 'Invalid code. Please try again.',
  MAX_SESSION_ATTEMPTS: 'Too many invalid attempts. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please try again.',
  GLOBAL_LOCKOUT: 'Too many failed attempts. Please try again later.',
  MFA_NOT_ENABLED: 'MFA is not enabled for your account.',
  NO_RECOVERY_CODES: 'No recovery codes found. Please set up MFA first.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNKNOWN_ERROR: 'An error occurred. Please try again.',
};

export const parseError = (error: AxiosError): ParsedError => {
  const responseData = error.response?.data as ErrorResponse | undefined;
  const backendMessage = responseData?.result?.[0]?.message || '';
  const metadata = responseData?.metadata;
  const errorCode = responseData?.error_code || '';
  const statusCode = error.response?.status;

  // Check if no attempts remaining - prevents 6th attempt
  if (metadata?.session_attempts_remaining === 0) {
    return {
      message: ERROR_MESSAGES.MAX_SESSION_ATTEMPTS,
      scenario: ErrorScenario.MAX_SESSION_ATTEMPTS,
      metadata,
    };
  }

  // Global lockout
  if (statusCode === STATUS_CODES.TOO_MANY_REQUESTS && metadata?.lockout_expires_at) {
    return {
      message: ERROR_MESSAGES.GLOBAL_LOCKOUT,
      scenario: ErrorScenario.GLOBAL_LOCKOUT,
      metadata,
    };
  }

  // Max session attempts
  if (
    statusCode === STATUS_CODES.TOO_MANY_REQUESTS &&
    BACKEND_ERROR_PATTERNS.TOO_MANY_ATTEMPTS.test(backendMessage)
  ) {
    return {
      message: ERROR_MESSAGES.MAX_SESSION_ATTEMPTS,
      scenario: ErrorScenario.MAX_SESSION_ATTEMPTS,
      metadata,
    };
  }

  // Session expired or not found
  if (
    statusCode === STATUS_CODES.UNAUTHORIZED &&
    (BACKEND_ERROR_PATTERNS.SESSION_NOT_FOUND.test(backendMessage) ||
      errorCode === 'AUTH.MFA.SESSION_NOT_FOUND' ||
      errorCode === 'AUTH.MFA.TOKEN_EXPIRED')
  ) {
    return {
      message: ERROR_MESSAGES.SESSION_EXPIRED,
      scenario: ErrorScenario.SESSION_EXPIRED,
      metadata,
    };
  }

  // Invalid TOTP code
  if (
    statusCode === STATUS_CODES.UNAUTHORIZED &&
    BACKEND_ERROR_PATTERNS.INVALID_TOTP.test(backendMessage)
  ) {
    return {
      message: ERROR_MESSAGES.INVALID_CODE,
      scenario: ErrorScenario.INVALID_CODE,
      metadata,
    };
  }

  // Invalid recovery code
  if (
    statusCode === STATUS_CODES.UNAUTHORIZED &&
    BACKEND_ERROR_PATTERNS.INVALID_RECOVERY.test(backendMessage)
  ) {
    return {
      message: ERROR_MESSAGES.INVALID_CODE,
      scenario: ErrorScenario.INVALID_CODE,
      metadata,
    };
  }

  // MFA not enabled
  if (
    statusCode === STATUS_CODES.FORBIDDEN ||
    BACKEND_ERROR_PATTERNS.MFA_NOT_ENABLED.test(backendMessage)
  ) {
    return {
      message: ERROR_MESSAGES.MFA_NOT_ENABLED,
      scenario: ErrorScenario.GENERIC,
      metadata,
    };
  }

  // No recovery codes found
  if (
    statusCode === STATUS_CODES.NOT_FOUND ||
    BACKEND_ERROR_PATTERNS.NO_RECOVERY_CODES.test(backendMessage)
  ) {
    return {
      message: ERROR_MESSAGES.NO_RECOVERY_CODES,
      scenario: ErrorScenario.GENERIC,
      metadata,
    };
  }

  // Network errors
  if (error.code === 'ERR_NETWORK') {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      scenario: ErrorScenario.GENERIC,
    };
  }

  // Fallback for 401 - likely invalid code
  if (statusCode === STATUS_CODES.UNAUTHORIZED) {
    return {
      message: ERROR_MESSAGES.INVALID_CODE,
      scenario: ErrorScenario.INVALID_CODE,
      metadata,
    };
  }

  // Default
  return {
    message: backendMessage || ERROR_MESSAGES.UNKNOWN_ERROR,
    scenario: ErrorScenario.GENERIC,
    metadata,
  };
};

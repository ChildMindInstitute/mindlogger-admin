import { AxiosError } from 'axios';

import { ErrorScenario, ErrorMetadata, ErrorResponse } from './mfa.types';

interface ParsedError {
  message: string;
  scenario: ErrorScenario;
  metadata?: ErrorMetadata;
}

interface ErrorMessages {
  INVALID_CODE: string;
  INVALID_VERIFICATION_CODE?: string;
  INVALID_RECOVERY_CODE?: string;
  MAX_ATTEMPTS: string;
  SESSION_EXPIRED: string;
  GLOBAL_LOCKOUT: string;
  NETWORK_ERROR: string;
  [key: string]: string | undefined;
}

interface BackendErrorPatterns {
  INVALID_TOTP: RegExp;
  INVALID_RECOVERY?: RegExp;
  TOO_MANY_ATTEMPTS: RegExp;
  SESSION_NOT_FOUND: RegExp;
  [key: string]: RegExp | undefined;
}

interface StatusCodes {
  UNAUTHORIZED: number;
  FORBIDDEN: number;
  NOT_FOUND?: number;
  TOO_MANY_REQUESTS: number;
}

/**
 * Generic error parser for MFA operations
 * Handles common error scenarios across different MFA features
 */
export const createErrorParser =
  (errorMessages: ErrorMessages, backendPatterns: BackendErrorPatterns, statusCodes: StatusCodes) =>
  (error: AxiosError, codeType?: 'totp' | 'recovery'): ParsedError => {
    const responseData = error.response?.data as ErrorResponse | undefined;
    const backendMessage = responseData?.result?.[0]?.message || '';
    const metadata = responseData?.metadata;
    const errorCode = responseData?.error_code || '';
    const statusCode = error.response?.status;

    // Network errors (no response at all)
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return {
        message: errorMessages.NETWORK_ERROR,
        scenario: ErrorScenario.GENERIC,
      };
    }

    // Global lockout - check this FIRST before other checks
    if (
      errorCode === 'AUTH.MFA.GLOBAL_LOCKOUT' ||
      metadata?.global_attempts_remaining === 0 ||
      (statusCode === statusCodes.TOO_MANY_REQUESTS && metadata?.lockout_expires_at)
    ) {
      return {
        message: errorMessages.GLOBAL_LOCKOUT,
        scenario: ErrorScenario.GLOBAL_LOCKOUT,
        metadata,
      };
    }

    // Check if no session attempts remaining - prevents 6th attempt
    if (metadata?.session_attempts_remaining === 0) {
      return {
        message: errorMessages.MAX_ATTEMPTS,
        scenario: ErrorScenario.MAX_SESSION_ATTEMPTS,
        metadata,
      };
    }

    // Max session attempts
    if (
      statusCode === statusCodes.TOO_MANY_REQUESTS &&
      backendPatterns.TOO_MANY_ATTEMPTS.test(backendMessage)
    ) {
      return {
        message: errorMessages.MAX_ATTEMPTS,
        scenario: ErrorScenario.MAX_SESSION_ATTEMPTS,
        metadata,
      };
    }

    // Session expired or not found
    if (
      statusCode === statusCodes.UNAUTHORIZED &&
      (backendPatterns.SESSION_NOT_FOUND.test(backendMessage) ||
        errorCode === 'AUTH.MFA.SESSION_NOT_FOUND' ||
        errorCode === 'AUTH.MFA.TOKEN_EXPIRED')
    ) {
      return {
        message: errorMessages.SESSION_EXPIRED,
        scenario: ErrorScenario.SESSION_EXPIRED,
        metadata,
      };
    }

    // Invalid TOTP code
    if (
      statusCode === statusCodes.UNAUTHORIZED &&
      backendPatterns.INVALID_TOTP.test(backendMessage)
    ) {
      const message = errorMessages.INVALID_VERIFICATION_CODE || errorMessages.INVALID_CODE;

      return {
        message,
        scenario: ErrorScenario.INVALID_CODE,
        metadata,
      };
    }

    // Invalid recovery code
    if (
      statusCode === statusCodes.UNAUTHORIZED &&
      backendPatterns.INVALID_RECOVERY &&
      backendPatterns.INVALID_RECOVERY.test(backendMessage)
    ) {
      const message = errorMessages.INVALID_RECOVERY_CODE || errorMessages.INVALID_CODE;

      return {
        message,
        scenario: ErrorScenario.INVALID_CODE,
        metadata,
      };
    }

    // Fallback for 401 - likely invalid code, differentiate based on codeType
    if (statusCode === statusCodes.UNAUTHORIZED) {
      if (codeType === 'recovery') {
        const message = errorMessages.INVALID_RECOVERY_CODE || errorMessages.INVALID_CODE;

        return {
          message,
          scenario: ErrorScenario.INVALID_CODE,
          metadata,
        };
      }

      // For TOTP or unspecified, prefer specific message
      const message = errorMessages.INVALID_VERIFICATION_CODE || errorMessages.INVALID_CODE;

      return {
        message,
        scenario: ErrorScenario.INVALID_CODE,
        metadata,
      };
    }

    // Forbidden (403) - check for specific patterns or use generic message
    if (statusCode === statusCodes.FORBIDDEN) {
      if (errorMessages.MFA_NOT_ENABLED) {
        return {
          message: errorMessages.MFA_NOT_ENABLED,
          scenario: ErrorScenario.GENERIC,
          metadata,
        };
      }
    }

    // Not Found (404) - check for specific patterns
    if (statusCode === statusCodes.NOT_FOUND && statusCodes.NOT_FOUND) {
      if (errorMessages.NO_RECOVERY_CODES) {
        return {
          message: errorMessages.NO_RECOVERY_CODES,
          scenario: ErrorScenario.GENERIC,
          metadata,
        };
      }
    }

    // Generic fallback
    const fallbackMessage =
      backendMessage || errorMessages.UNKNOWN_ERROR || errorMessages.INVALID_CODE;

    return {
      message: fallbackMessage,
      scenario: ErrorScenario.GENERIC,
      metadata,
    };
  };

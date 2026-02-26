/**
 * Error messages for MFA disable operations
 */
export const MFA_DISABLE_ERROR_MESSAGES = {
  NOT_ENABLED: 'mfaNotEnabled',
  INVALID_CODE: 'invalidCode', // Fallback, same as INVALID_VERIFICATION_CODE
  INVALID_VERIFICATION_CODE: 'invalidMFACode',
  INVALID_RECOVERY_CODE: 'invalidRecoveryCode',
  RECOVERY_CODE_USED: 'recoveryCodeAlreadyUsed',
  SESSION_EXPIRED: 'mfaSessionExpired',
  EXPIRED_SESSION: 'mfaSessionExpired', // Alias for SESSION_EXPIRED, used in useRemoveMFA
  MAX_ATTEMPTS: 'tooManyAttempts',
  GLOBAL_LOCKOUT: 'tooManyAttempts',
  SESSION_MISMATCH: 'mfaSessionExpired',
  NETWORK_ERROR: 'networkError',
  UNKNOWN_ERROR: 'somethingWentWrong',
} as const;

/**
 * Regular expression patterns to match backend error messages
 */
export const BACKEND_ERROR_PATTERNS = {
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
} as const;

/**
 * HTTP status codes for MFA disable operations
 */
export const MFA_DISABLE_STATUS_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
} as const;

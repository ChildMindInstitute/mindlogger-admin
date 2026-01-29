/**
 * MFA Setup Constants
 */

export const MFA_CONSTANTS = {
  CODE_LENGTH: 6,
  CODE_PATTERN: /^\d{6}$/,
} as const;

export const MFA_ERROR_MESSAGES = {
  INVALID_CODE: 'invalidMFACode',
  EXPIRED_SETUP: 'mfaSessionExpired',
  SETUP_NOT_FOUND: 'mfaSessionExpired',
  NETWORK_ERROR: 'networkError',
  UNKNOWN_ERROR: 'somethingWentWrong',
  ALREADY_ENABLED: 'mfaAlreadyEnabled',
} as const;

// Backend error message patterns for matching
export const BACKEND_ERROR_PATTERNS = {
  EXPIRED: /expired/i,
  INVALID_CODE: /invalid.*totp.*code/i,
  NO_PENDING: /no pending mfa/i,
  ALREADY_ENABLED: /already.*enabled|mfa.*enabled/i,
} as const;

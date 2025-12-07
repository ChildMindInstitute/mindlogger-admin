/**
 * MFA Setup Constants
 */

export const MFA_CONSTANTS = {
  CODE_LENGTH: 6,
  CODE_PATTERN: /^\d{6}$/,
} as const;

export const MFA_ERROR_MESSAGES = {
  INVALID_CODE: 'Invalid Code',
  EXPIRED_SETUP: 'Setup expired. Please reinitiate MFA',
  SETUP_NOT_FOUND: 'No setup found. Please reinitiate MFA',
  NETWORK_ERROR: 'Network Error',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
} as const;

// Backend error message patterns for matching
export const BACKEND_ERROR_PATTERNS = {
  EXPIRED: /expired/i,
  INVALID_CODE: /invalid.*totp.*code/i,
  NO_PENDING: /no pending mfa/i,
} as const;

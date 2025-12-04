/**
 * MFA Setup Constants
 */

export const MFA_CONSTANTS = {
  CODE_LENGTH: 6,
  CODE_PATTERN: /^\d{6}$/,
} as const;

export const MFA_ERROR_MESSAGES = {
  INVALID_CODE: 'Invalid TOTP code. Please check your authenticator app and try again.',
  EXPIRED_SETUP: 'MFA setup has expired. Please initiate MFA setup again.',
  SETUP_NOT_FOUND: 'No pending MFA setup found. Please initiate MFA setup first.',
  NETWORK_ERROR: 'Unable to connect. Please check your connection and try again.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
} as const;

// Backend error message patterns for matching
export const BACKEND_ERROR_PATTERNS = {
  EXPIRED: /expired/i,
  INVALID_CODE: /invalid.*totp.*code/i,
  NO_PENDING: /no pending mfa/i,
} as const;

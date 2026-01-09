import { createErrorParser } from 'modules/Dashboard/features/AccountSettings/shared/mfa';

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
  INVALID_CODE: 'Invalid TOTP code. Please check your authenticator app and try again.', // Fallback, same as INVALID_VERIFICATION_CODE
  INVALID_VERIFICATION_CODE: 'Invalid TOTP code. Please check your authenticator app and try again.',
  INVALID_RECOVERY_CODE: 'Invalid recovery code. Please check the code and try again.',
  MAX_ATTEMPTS: 'Too many invalid attempts. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please try again.',
  GLOBAL_LOCKOUT: 'Too many failed attempts. Please try again later.',
  MFA_NOT_ENABLED: 'MFA is not enabled for your account.',
  NO_RECOVERY_CODES: 'No recovery codes found. Please set up MFA first.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNKNOWN_ERROR: 'An error occurred. Please try again.',
};

export const parseError = createErrorParser(ERROR_MESSAGES, BACKEND_ERROR_PATTERNS, STATUS_CODES);

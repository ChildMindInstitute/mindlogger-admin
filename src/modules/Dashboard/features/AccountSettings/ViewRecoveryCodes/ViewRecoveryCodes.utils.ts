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
  INVALID_CODE: 'invalidCode', // Fallback, same as INVALID_VERIFICATION_CODE
  INVALID_VERIFICATION_CODE: 'invalidMFACode',
  INVALID_RECOVERY_CODE: 'invalidRecoveryCode',
  MAX_ATTEMPTS: 'tooManyAttempts',
  SESSION_EXPIRED: 'mfaSessionExpired',
  GLOBAL_LOCKOUT: 'tooManyAttempts',
  MFA_NOT_ENABLED: 'mfaNotEnabled',
  NO_RECOVERY_CODES: 'mfaNotEnabled',
  NETWORK_ERROR: 'networkError',
  UNKNOWN_ERROR: 'somethingWentWrong',
};

export const parseError = createErrorParser(ERROR_MESSAGES, BACKEND_ERROR_PATTERNS, STATUS_CODES);

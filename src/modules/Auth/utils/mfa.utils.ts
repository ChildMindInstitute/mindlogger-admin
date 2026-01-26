/**
 * MFA Error Codes - matches backend AUTH.MFA namespace
 * @see mindlogger-backend-refactor/src/apps/authentication/constants.py
 */
export const MFA_ERROR_CODES = {
  // TOTP verification errors
  INVALID_TOTP_CODE: 'AUTH.MFA.INVALID_TOTP_CODE',
  // Recovery code errors
  INVALID_RECOVERY_CODE: 'AUTH.MFA.INVALID_RECOVERY_CODE',
  // Session/token expiry errors
  TOKEN_EXPIRED: 'AUTH.MFA.TOKEN_EXPIRED',
  TOKEN_INVALID: 'AUTH.MFA.TOKEN_INVALID',
  TOKEN_MALFORMED: 'AUTH.MFA.TOKEN_MALFORMED',
  SESSION_NOT_FOUND: 'AUTH.MFA.SESSION_NOT_FOUND',
  // Rate limiting errors
  TOO_MANY_ATTEMPTS: 'AUTH.MFA.TOO_MANY_ATTEMPTS',
  GLOBAL_LOCKOUT: 'AUTH.MFA.GLOBAL_LOCKOUT',
} as const;

/** Error codes that end the MFA session (terminal state - user must re-login) */
const SESSION_EXPIRED_CODES = [
  MFA_ERROR_CODES.TOKEN_EXPIRED,
  MFA_ERROR_CODES.TOKEN_INVALID,
  MFA_ERROR_CODES.TOKEN_MALFORMED,
  MFA_ERROR_CODES.SESSION_NOT_FOUND,
  MFA_ERROR_CODES.TOO_MANY_ATTEMPTS,
  MFA_ERROR_CODES.GLOBAL_LOCKOUT,
];

/** Translation keys that match app-en.json / app-fr.json */
const TRANSLATION_KEYS = {
  INVALID_CODE: 'invalidCode',
  INVALID_RECOVERY_CODE: 'invalidRecoveryCode',
  SESSION_EXPIRED: 'mfaSessionExpired',
  TOO_MANY_ATTEMPTS: 'tooManyAttempts',
} as const;

export type MfaVerificationType = 'totp' | 'recovery';

export interface MfaErrorResult {
  translationKey: string;
  isSessionExpired: boolean;
  attemptsRemaining: number | null;
}

/**
 * Extract and map MFA error from API response
 * Maps ALL backend error codes to appropriate translations
 */
export const getMfaErrorResult = (error: unknown, type: MfaVerificationType): MfaErrorResult => {
  // Extract from axios error response
  const axiosError = error as {
    response?: {
      data?: {
        error_code?: string;
        metadata?: { session_attempts_remaining?: number };
      };
    };
  };
  const errorCode = axiosError?.response?.data?.error_code;
  const attemptsRemaining =
    axiosError?.response?.data?.metadata?.session_attempts_remaining ?? null;

  // Check if session expired (terminal state)
  const isSessionExpired = errorCode ? SESSION_EXPIRED_CODES.includes(errorCode as any) : false;

  // Map error_code to translation key
  let translationKey: string;
  switch (errorCode) {
    // Session/token errors → "Your session has expired..."
    case MFA_ERROR_CODES.TOKEN_EXPIRED:
    case MFA_ERROR_CODES.TOKEN_INVALID:
    case MFA_ERROR_CODES.TOKEN_MALFORMED:
    case MFA_ERROR_CODES.SESSION_NOT_FOUND:
      translationKey = TRANSLATION_KEYS.SESSION_EXPIRED;
      break;

    // Rate limiting → "Too many failed attempts..."
    case MFA_ERROR_CODES.TOO_MANY_ATTEMPTS:
    case MFA_ERROR_CODES.GLOBAL_LOCKOUT:
      translationKey = TRANSLATION_KEYS.TOO_MANY_ATTEMPTS;
      break;

    // Invalid TOTP → "Invalid code"
    case MFA_ERROR_CODES.INVALID_TOTP_CODE:
      translationKey = TRANSLATION_KEYS.INVALID_CODE;
      break;

    // Invalid recovery → "Invalid recovery code"
    case MFA_ERROR_CODES.INVALID_RECOVERY_CODE:
      translationKey = TRANSLATION_KEYS.INVALID_RECOVERY_CODE;
      break;

    // Fallback when error_code missing or unknown
    default:
      translationKey =
        type === 'totp' ? TRANSLATION_KEYS.INVALID_CODE : TRANSLATION_KEYS.INVALID_RECOVERY_CODE;
  }

  return { translationKey, isSessionExpired, attemptsRemaining };
};

// Remove all non-numeric characters
export const formatMFACode = (value: string): string => value.replace(/\D/g, '').slice(0, 6);

export const formatRecoveryCode = (value: string): string => {
  // Remove all non-alphanumeric characters and convert to uppercase
  const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  // Add hyphen after 5 characters if needed
  if (cleaned.length > 5) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 10)}`;
  }

  return cleaned;
};

export const isValidMFACode = (code: string): boolean => /^\d{6}$/.test(code);

export const isValidRecoveryCode = (code: string): boolean =>
  /^[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(code);

import { TFunction } from 'i18next';

export interface MFAError {
  code: string;
  userMessage: string;
  action?: 'retry' | 'redirect' | 'lockout';
  redirectTo?: string;
}

// Map of backend error messages to user-friendly messages and actions
const MFA_ERROR_MAP: Record<string, (t: TFunction) => MFAError> = {
  'Invalid TOTP code': (t) => ({
    code: 'INVALID_CODE',
    userMessage: t('invalidCode'),
    action: 'retry',
  }),
  'Invalid recovery code': (t) => ({
    code: 'INVALID_RECOVERY',
    userMessage: t('invalidRecoveryCode'),
    action: 'retry',
  }),
  'Too many attempts': (t) => ({
    code: 'TOO_MANY_ATTEMPTS',
    userMessage: t('tooManyAttempts'),
    action: 'lockout',
    redirectTo: '/login',
  }),
  'MFA token expired': (t) => ({
    code: 'SESSION_EXPIRED',
    userMessage: t('mfaSessionExpired'),
    action: 'redirect',
    redirectTo: '/login',
  }),
  'MFA session expired': (t) => ({
    code: 'SESSION_EXPIRED',
    userMessage: t('mfaSessionExpired'),
    action: 'redirect',
    redirectTo: '/login',
  }),
  'Recovery code not found': (t) => ({
    code: 'RECOVERY_NOT_FOUND',
    userMessage: t('invalidRecoveryCode'),
    action: 'retry',
  }),
  'Recovery code already used': (t) => ({
    code: 'RECOVERY_USED',
    userMessage: t('recoveryCodeAlreadyUsed'),
    action: 'retry',
  }),
};

export const getMFAError = (errorMessage: string, t: TFunction): MFAError => {
  // Check for known error patterns
  for (const [pattern, errorFunc] of Object.entries(MFA_ERROR_MAP)) {
    if (errorMessage.includes(pattern)) {
      return errorFunc(t);
    }
  }

  // Default error
  return {
    code: 'UNKNOWN',
    userMessage: t('somethingWentWrong'),
    action: 'retry',
  };
};

export const shouldShowAttemptsWarning = (attempts: number): boolean =>
  attempts >= 3 && attempts < 5;

export const getRemainingAttempts = (attempts: number): number => {
  const MAX_ATTEMPTS = 5;

  return Math.max(0, MAX_ATTEMPTS - attempts);
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

// Check if MFA session is expired
export const isMFASessionExpired = (expiresAt: number): boolean => Date.now() > expiresAt;

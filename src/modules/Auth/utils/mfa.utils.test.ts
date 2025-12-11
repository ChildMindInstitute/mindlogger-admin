import { TFunction } from 'i18next';

import {
  getMFAError,
  shouldShowAttemptsWarning,
  getRemainingAttempts,
  formatMFACode,
  formatRecoveryCode,
  isValidMFACode,
  isValidRecoveryCode,
  isMFASessionExpired,
} from './mfa.utils';

describe('MFA Utilities', () => {
  describe('getMFAError', () => {
    const mockT = ((key: string) => key) as unknown as TFunction;

    it('returns correct error for known error messages', () => {
      const testCases = [
        {
          error: 'Invalid TOTP code',
          expected: {
            code: 'INVALID_CODE',
            userMessage: 'invalidCode',
            action: 'retry',
          },
        },
        {
          error: 'Invalid recovery code',
          expected: {
            code: 'INVALID_RECOVERY',
            userMessage: 'invalidRecoveryCode',
            action: 'retry',
          },
        },
        {
          error: 'Too many attempts',
          expected: {
            code: 'TOO_MANY_ATTEMPTS',
            userMessage: 'tooManyAttempts',
            action: 'lockout',
            redirectTo: '/login',
          },
        },
        {
          error: 'MFA token expired',
          expected: {
            code: 'SESSION_EXPIRED',
            userMessage: 'mfaSessionExpired',
            action: 'redirect',
            redirectTo: '/login',
          },
        },
        {
          error: 'Recovery code already used',
          expected: {
            code: 'RECOVERY_USED',
            userMessage: 'recoveryCodeAlreadyUsed',
            action: 'retry',
          },
        },
      ];

      testCases.forEach(({ error, expected }) => {
        const result = getMFAError(error, mockT);
        expect(result).toEqual(expected);
      });
    });

    it('returns default error for unknown messages', () => {
      const result = getMFAError('Some unknown error', mockT);
      expect(result).toEqual({
        code: 'UNKNOWN',
        userMessage: 'somethingWentWrong',
        action: 'retry',
      });
    });

    it('matches partial error messages', () => {
      const result = getMFAError('Error: Invalid TOTP code provided', mockT);
      expect(result.code).toBe('INVALID_CODE');
      expect(result.userMessage).toBe('invalidCode');
    });
  });

  describe('shouldShowAttemptsWarning', () => {
    it('returns true for 3-4 attempts', () => {
      expect(shouldShowAttemptsWarning(3)).toBe(true);
      expect(shouldShowAttemptsWarning(4)).toBe(true);
    });

    it('returns false for less than 3 attempts', () => {
      expect(shouldShowAttemptsWarning(0)).toBe(false);
      expect(shouldShowAttemptsWarning(1)).toBe(false);
      expect(shouldShowAttemptsWarning(2)).toBe(false);
    });

    it('returns false for 5 or more attempts', () => {
      expect(shouldShowAttemptsWarning(5)).toBe(false);
      expect(shouldShowAttemptsWarning(6)).toBe(false);
      expect(shouldShowAttemptsWarning(10)).toBe(false);
    });
  });

  describe('getRemainingAttempts', () => {
    it('calculates remaining attempts correctly', () => {
      expect(getRemainingAttempts(0)).toBe(5);
      expect(getRemainingAttempts(1)).toBe(4);
      expect(getRemainingAttempts(2)).toBe(3);
      expect(getRemainingAttempts(3)).toBe(2);
      expect(getRemainingAttempts(4)).toBe(1);
      expect(getRemainingAttempts(5)).toBe(0);
    });

    it('returns 0 for attempts beyond max', () => {
      expect(getRemainingAttempts(6)).toBe(0);
      expect(getRemainingAttempts(10)).toBe(0);
    });
  });

  describe('formatMFACode', () => {
    it('removes non-numeric characters', () => {
      expect(formatMFACode('123abc456')).toBe('123456');
      expect(formatMFACode('1-2-3-4-5-6')).toBe('123456');
      expect(formatMFACode('  123 456  ')).toBe('123456');
    });

    it('limits to 6 digits', () => {
      expect(formatMFACode('1234567890')).toBe('123456');
      expect(formatMFACode('123')).toBe('123');
    });

    it('handles empty input', () => {
      expect(formatMFACode('')).toBe('');
    });

    it('handles special characters', () => {
      expect(formatMFACode('!@#$%^&*()')).toBe('');
      expect(formatMFACode('1!2@3#4$5%6')).toBe('123456');
    });
  });

  describe('formatRecoveryCode', () => {
    it('converts to uppercase and adds hyphen', () => {
      expect(formatRecoveryCode('abcde12345')).toBe('ABCDE-12345');
      expect(formatRecoveryCode('AbCdE12345')).toBe('ABCDE-12345');
    });

    it('removes non-alphanumeric characters', () => {
      expect(formatRecoveryCode('AB!CD@E-12#34$5')).toBe('ABCDE-12345');
      expect(formatRecoveryCode('  ABCDE  12345  ')).toBe('ABCDE-12345');
    });

    it('handles codes shorter than 5 characters', () => {
      expect(formatRecoveryCode('ABC')).toBe('ABC');
      expect(formatRecoveryCode('ABCD')).toBe('ABCD');
      expect(formatRecoveryCode('ABCDE')).toBe('ABCDE');
    });

    it('limits to 10 characters', () => {
      expect(formatRecoveryCode('ABCDEFGHIJKLMNOP')).toBe('ABCDE-FGHIJ');
    });

    it('handles empty input', () => {
      expect(formatRecoveryCode('')).toBe('');
    });

    it('preserves existing hyphen position', () => {
      expect(formatRecoveryCode('ABCDE-12345')).toBe('ABCDE-12345');
    });
  });

  describe('isValidMFACode', () => {
    it('validates correct 6-digit codes', () => {
      expect(isValidMFACode('123456')).toBe(true);
      expect(isValidMFACode('000000')).toBe(true);
      expect(isValidMFACode('999999')).toBe(true);
    });

    it('rejects invalid codes', () => {
      expect(isValidMFACode('12345')).toBe(false); // too short
      expect(isValidMFACode('1234567')).toBe(false); // too long
      expect(isValidMFACode('12345a')).toBe(false); // contains letter
      expect(isValidMFACode('123 456')).toBe(false); // contains space
      expect(isValidMFACode('')).toBe(false); // empty
      expect(isValidMFACode('123-456')).toBe(false); // contains hyphen
    });
  });

  describe('isValidRecoveryCode', () => {
    it('validates correct recovery codes', () => {
      expect(isValidRecoveryCode('ABCDE-12345')).toBe(true);
      expect(isValidRecoveryCode('A1B2C-3D4E5')).toBe(true);
      expect(isValidRecoveryCode('00000-00000')).toBe(true);
      expect(isValidRecoveryCode('ZZZZZ-99999')).toBe(true);
    });

    it('rejects invalid codes', () => {
      expect(isValidRecoveryCode('ABCDE12345')).toBe(false); // no hyphen
      expect(isValidRecoveryCode('ABCDE-1234')).toBe(false); // too short
      expect(isValidRecoveryCode('ABCD-12345')).toBe(false); // first part too short
      expect(isValidRecoveryCode('abcde-12345')).toBe(false); // lowercase
      expect(isValidRecoveryCode('ABCDE_12345')).toBe(false); // wrong separator
      expect(isValidRecoveryCode('')).toBe(false); // empty
      expect(isValidRecoveryCode('ABCDE-123456')).toBe(false); // too long
    });
  });

  describe('isMFASessionExpired', () => {
    it('correctly identifies expired sessions', () => {
      const now = Date.now();

      // Expired sessions
      expect(isMFASessionExpired(now - 1000)).toBe(true);
      expect(isMFASessionExpired(now - 1)).toBe(true);
      expect(isMFASessionExpired(0)).toBe(true);

      // Non-expired sessions
      expect(isMFASessionExpired(now + 1000)).toBe(false);
      expect(isMFASessionExpired(now + 60000)).toBe(false);
    });

    it('handles edge cases', () => {
      const now = Date.now();

      // Exactly now (should be considered expired)
      expect(isMFASessionExpired(now)).toBe(false);

      // Very far future
      expect(isMFASessionExpired(Number.MAX_SAFE_INTEGER)).toBe(false);
    });
  });
});

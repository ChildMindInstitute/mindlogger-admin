import {
  getMfaErrorResult,
  MFA_ERROR_CODES,
  formatMFACode,
  formatRecoveryCode,
  isValidMFACode,
  isValidRecoveryCode,
} from './mfa.utils';

// Helper to create mock axios error with error_code and metadata
const createMockAxiosError = (errorCode?: string, attemptsRemaining?: number) => ({
  response: {
    data: {
      error_code: errorCode,
      metadata:
        attemptsRemaining !== undefined
          ? { session_attempts_remaining: attemptsRemaining }
          : undefined,
    },
  },
});

describe('MFA Utilities', () => {
  describe('getMfaErrorResult', () => {
    describe('TOTP verification errors', () => {
      it('returns invalidCode for INVALID_TOTP_CODE', () => {
        const error = createMockAxiosError(MFA_ERROR_CODES.INVALID_TOTP_CODE, 3);
        const result = getMfaErrorResult(error, 'totp');

        expect(result).toEqual({
          translationKey: 'invalidCode',
          isSessionExpired: false,
          attemptsRemaining: 3,
        });
      });

      it('returns invalidCode as fallback for unknown error in totp mode', () => {
        const error = createMockAxiosError('UNKNOWN_ERROR');
        const result = getMfaErrorResult(error, 'totp');

        expect(result.translationKey).toBe('invalidCode');
        expect(result.isSessionExpired).toBe(false);
      });

      it('returns invalidCode for null/undefined error_code in totp mode', () => {
        const error = createMockAxiosError(undefined);
        const result = getMfaErrorResult(error, 'totp');

        expect(result.translationKey).toBe('invalidCode');
        expect(result.isSessionExpired).toBe(false);
        expect(result.attemptsRemaining).toBeNull();
      });
    });

    describe('Recovery code verification errors', () => {
      it('returns invalidRecoveryCode for INVALID_RECOVERY_CODE', () => {
        const error = createMockAxiosError(MFA_ERROR_CODES.INVALID_RECOVERY_CODE, 2);
        const result = getMfaErrorResult(error, 'recovery');

        expect(result).toEqual({
          translationKey: 'invalidRecoveryCode',
          isSessionExpired: false,
          attemptsRemaining: 2,
        });
      });

      it('returns invalidRecoveryCode as fallback for unknown error in recovery mode', () => {
        const error = createMockAxiosError('UNKNOWN_ERROR');
        const result = getMfaErrorResult(error, 'recovery');

        expect(result.translationKey).toBe('invalidRecoveryCode');
        expect(result.isSessionExpired).toBe(false);
      });
    });

    describe('Session expiry errors', () => {
      const sessionExpiredCodes = [
        MFA_ERROR_CODES.TOKEN_EXPIRED,
        MFA_ERROR_CODES.TOKEN_INVALID,
        MFA_ERROR_CODES.TOKEN_MALFORMED,
        MFA_ERROR_CODES.SESSION_NOT_FOUND,
      ];

      sessionExpiredCodes.forEach((errorCode) => {
        it(`returns mfaSessionExpired with isSessionExpired=true for ${errorCode}`, () => {
          const error = createMockAxiosError(errorCode);
          const result = getMfaErrorResult(error, 'totp');

          expect(result).toEqual({
            translationKey: 'mfaSessionExpired',
            isSessionExpired: true,
            attemptsRemaining: null,
          });
        });
      });
    });

    describe('Rate limiting errors', () => {
      it('returns tooManyAttempts with isSessionExpired=true for TOO_MANY_ATTEMPTS', () => {
        const error = createMockAxiosError(MFA_ERROR_CODES.TOO_MANY_ATTEMPTS);
        const result = getMfaErrorResult(error, 'totp');

        expect(result).toEqual({
          translationKey: 'tooManyAttempts',
          isSessionExpired: true,
          attemptsRemaining: null,
        });
      });

      it('returns tooManyAttempts with isSessionExpired=true for GLOBAL_LOCKOUT', () => {
        const error = createMockAxiosError(MFA_ERROR_CODES.GLOBAL_LOCKOUT);
        const result = getMfaErrorResult(error, 'totp');

        expect(result).toEqual({
          translationKey: 'tooManyAttempts',
          isSessionExpired: true,
          attemptsRemaining: null,
        });
      });
    });

    describe('attemptsRemaining extraction', () => {
      it('extracts attemptsRemaining from metadata', () => {
        const error = createMockAxiosError(MFA_ERROR_CODES.INVALID_TOTP_CODE, 2);
        const result = getMfaErrorResult(error, 'totp');

        expect(result.attemptsRemaining).toBe(2);
      });

      it('returns null when metadata is missing', () => {
        const error = { response: { data: { error_code: MFA_ERROR_CODES.INVALID_TOTP_CODE } } };
        const result = getMfaErrorResult(error, 'totp');

        expect(result.attemptsRemaining).toBeNull();
      });

      it('returns null for malformed error object', () => {
        const result = getMfaErrorResult({}, 'totp');

        expect(result.attemptsRemaining).toBeNull();
      });

      it('returns null for null error', () => {
        const result = getMfaErrorResult(null, 'totp');

        expect(result.attemptsRemaining).toBeNull();
      });
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
});

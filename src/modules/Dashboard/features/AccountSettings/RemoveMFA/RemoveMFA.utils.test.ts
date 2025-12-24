/**
 * Tests for RemoveMFA utility functions
 *
 * Tests the error message mapping logic that converts backend errors
 * into user-friendly messages during MFA disable operations.
 */

import { describe, it, expect, vi } from 'vitest';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { getErrorMessage } from './RemoveMFA.utils';
import { MFA_DISABLE_ERROR_MESSAGES } from './RemoveMFA.constants';

/**
 * Helper to create mock AxiosError with specific status and message
 */
const createAxiosError = (status?: number, message?: string, code?: string): AxiosError => {
  const error = new Error('Mock error') as AxiosError;
  error.isAxiosError = true;
  error.code = code;
  error.response = status
    ? {
        status,
        data: {
          result: message ? [{ message }] : [],
        },
        statusText: 'Error',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      }
    : undefined;

  return error;
};

describe('RemoveMFA.utils', () => {
  describe('getErrorMessage', () => {
    /**
     * Backend Message Pattern Tests
     * These tests verify error mapping based on specific backend messages
     */
    describe('Backend message patterns', () => {
      it('should return NOT_ENABLED message when MFA is not enabled', () => {
        const error = createAxiosError(403, 'MFA is not enabled for this user');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.NOT_ENABLED);
      });

      it('should return RECOVERY_CODE_USED message when code already used', () => {
        const error = createAxiosError(400, 'This recovery code has already been used');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.RECOVERY_CODE_USED);
      });

      it('should return RECOVERY_CODE_INVALID message for invalid or not found recovery code', () => {
        // Test both RECOVERY_INVALID and RECOVERY_NOT_FOUND patterns
        const invalidError = createAxiosError(401, 'Invalid recovery code provided');
        expect(getErrorMessage(invalidError)).toBe(
          MFA_DISABLE_ERROR_MESSAGES.RECOVERY_CODE_INVALID,
        );

        const notFoundError = createAxiosError(404, 'No matching recovery code found');
        expect(getErrorMessage(notFoundError)).toBe(
          MFA_DISABLE_ERROR_MESSAGES.RECOVERY_CODE_INVALID,
        );
      });

      it('should return GLOBAL_LOCKOUT message when account is locked', () => {
        const error = createAxiosError(
          429,
          'Account temporarily locked due to multiple failed MFA attempts',
        );
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.GLOBAL_LOCKOUT);
      });

      it('should return MAX_ATTEMPTS message for too many invalid attempts', () => {
        const error = createAxiosError(429, 'Too many invalid TOTP attempts. Try again later.');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.MAX_ATTEMPTS);
      });

      it('should return EXPIRED_SESSION message when session not found', () => {
        const error = createAxiosError(404, 'MFA session not found or expired');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION);
      });

      it('should return SESSION_MISMATCH message for invalid session', () => {
        const error = createAxiosError(400, 'Invalid MFA session for this operation');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.SESSION_MISMATCH);
      });

      it('should return INVALID_CODE message for invalid TOTP code', () => {
        const error = createAxiosError(401, 'Invalid TOTP code provided');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.INVALID_CODE);
      });
    });

    /**
     * Status Code Fallback Tests
     * These tests verify error mapping when backend message doesn't match patterns
     */
    describe('Status code fallbacks', () => {
      it('should return INVALID_CODE for 401 without specific message', () => {
        const error = createAxiosError(401, 'Unauthorized request');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.INVALID_CODE);
      });

      it('should return EXPIRED_SESSION for 401 with "expired" in message', () => {
        const error = createAxiosError(401, 'Session has expired, please login again');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION);
      });

      it('should return NOT_ENABLED for 403 without specific message', () => {
        const error = createAxiosError(403, 'Access forbidden');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.NOT_ENABLED);
      });

      it('should return EXPIRED_SESSION for 404 without specific message', () => {
        const error = createAxiosError(404, 'Resource not found');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION);
      });

      it('should return GLOBAL_LOCKOUT for 429 without specific message', () => {
        const error = createAxiosError(429, 'Rate limit exceeded');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.GLOBAL_LOCKOUT);
      });
    });

    /**
     * Network Error Tests
     * These tests verify handling of network-related errors
     */
    describe('Network errors', () => {
      it('should return NETWORK_ERROR when error code is ERR_NETWORK', () => {
        const error = createAxiosError(undefined, undefined, 'ERR_NETWORK');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.NETWORK_ERROR);
      });

      it('should return NETWORK_ERROR when response is undefined', () => {
        const error = new Error('Network failure') as AxiosError;
        error.isAxiosError = true;
        error.response = undefined;
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.NETWORK_ERROR);
      });
    });

    /**
     * Unknown Error Tests
     * These tests verify fallback behavior for unexpected errors
     */
    describe('Unknown errors', () => {
      it('should return UNKNOWN_ERROR for unhandled status codes', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const error = createAxiosError(500, 'Internal server error');
        const result = getErrorMessage(error);

        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.UNKNOWN_ERROR);
        expect(consoleSpy).toHaveBeenCalledWith(
          'Unexpected MFA disable error:',
          expect.objectContaining({
            status: 500,
            message: 'Internal server error',
          }),
        );

        consoleSpy.mockRestore();
      });

      it('should return UNKNOWN_ERROR when error data structure is unexpected', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const error = new Error('Unknown error') as AxiosError;
        error.isAxiosError = true;
        error.response = {
          status: 418,
          data: { unexpected: 'structure' },
          statusText: 'I am a teapot',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        };

        const result = getErrorMessage(error);

        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.UNKNOWN_ERROR);
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
      });
    });

    /**
     * Edge Case Tests
     * These tests verify handling of malformed or edge case inputs
     */
    describe('Edge cases', () => {
      it('should handle empty or missing backend messages', () => {
        // Empty message string
        const emptyError = createAxiosError(401, '');
        expect(getErrorMessage(emptyError)).toBe(MFA_DISABLE_ERROR_MESSAGES.INVALID_CODE);

        // Missing result array
        const noResultError = new Error('Mock error') as AxiosError;
        noResultError.isAxiosError = true;
        noResultError.response = {
          status: 401,
          data: { result: undefined },
          statusText: 'Unauthorized',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        };
        expect(getErrorMessage(noResultError)).toBe(MFA_DISABLE_ERROR_MESSAGES.INVALID_CODE);

        // Empty result array
        const emptyResultError = createAxiosError(401);
        expect(getErrorMessage(emptyResultError)).toBe(MFA_DISABLE_ERROR_MESSAGES.INVALID_CODE);
      });

      it('should handle case-insensitive pattern matching', () => {
        const error = createAxiosError(401, 'INVALID TOTP CODE PROVIDED');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.INVALID_CODE);
      });
    });

    /**
     * Priority Tests
     * These tests verify that backend message patterns take precedence over status codes
     */
    describe('Message pattern priority', () => {
      it('should prioritize backend message over status code for recovery code errors', () => {
        // 401 normally returns INVALID_CODE, but backend message should take precedence
        const error = createAxiosError(401, 'Invalid recovery code provided');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.RECOVERY_CODE_INVALID);
      });

      it('should prioritize backend message over status code for lockout', () => {
        // 401 normally returns INVALID_CODE, but lockout message should take precedence
        const error = createAxiosError(
          401,
          'Account temporarily locked due to multiple failed MFA attempts',
        );
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.GLOBAL_LOCKOUT);
      });

      it('should prioritize backend message over status code for session errors', () => {
        // 401 normally returns INVALID_CODE, but session message should take precedence
        const error = createAxiosError(401, 'MFA session not found or expired');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION);
      });
    });
  });
});

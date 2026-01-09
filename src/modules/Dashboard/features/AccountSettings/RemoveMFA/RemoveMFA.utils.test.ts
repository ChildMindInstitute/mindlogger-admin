/**
 * Tests for RemoveMFA utility functions
 * Tests getErrorMessage function which wraps the shared parseError
 */

import { describe, it, expect } from 'vitest';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { getErrorMessage } from './RemoveMFA.utils';
import { MFA_DISABLE_ERROR_MESSAGES } from './RemoveMFA.constants';

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
    describe('Backend message patterns', () => {
      it('should return INVALID_VERIFICATION_CODE message for invalid TOTP code', () => {
        const error = createAxiosError(401, 'Invalid TOTP code provided');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.INVALID_VERIFICATION_CODE);
      });

      it('should return MAX_ATTEMPTS message for too many invalid attempts', () => {
        const error = createAxiosError(429, 'Too many invalid TOTP attempts. Try again later.');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.MAX_ATTEMPTS);
      });

      it('should return EXPIRED_SESSION message when session not found', () => {
        const error = createAxiosError(401, 'MFA session not found or expired');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION);
      });
    });

    describe('Status code fallbacks', () => {
      it('should return INVALID_VERIFICATION_CODE for 401 without specific message', () => {
        const error = createAxiosError(401, 'Unauthorized request');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.INVALID_VERIFICATION_CODE);
      });
    });

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

    describe('Unmapped cases (returns backend message)', () => {
      it('should return backend message for unmapped 403 error', () => {
        const error = createAxiosError(403, 'MFA is not enabled for this user');
        const result = getErrorMessage(error);
        // Parser returns backend message for unmapped cases
        expect(result).toBe('MFA is not enabled for this user');
      });

      it('should return INVALID_VERIFICATION_CODE for unmapped 400 error', () => {
        const error = createAxiosError(400, 'This recovery code has already been used');
        const result = getErrorMessage(error);
        // 400 status code is now handled as invalid code error
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.INVALID_VERIFICATION_CODE);
      });

      it('should return backend message for unmapped 404 error', () => {
        const error = createAxiosError(404, 'Resource not found');
        const result = getErrorMessage(error);
        expect(result).toBe('Resource not found');
      });

      it('should return backend message for unmapped 429 error', () => {
        const error = createAxiosError(429, 'Rate limit exceeded');
        const result = getErrorMessage(error);
        expect(result).toBe('Rate limit exceeded');
      });

      it('should return backend message for unmapped 500 error', () => {
        const error = createAxiosError(500, 'Internal server error');
        const result = getErrorMessage(error);
        expect(result).toBe('Internal server error');
      });
    });

    describe('Edge cases', () => {
      it('should handle empty backend messages', () => {
        const emptyError = createAxiosError(401, '');
        expect(getErrorMessage(emptyError)).toBe(
          MFA_DISABLE_ERROR_MESSAGES.INVALID_VERIFICATION_CODE,
        );
      });

      it('should handle case-insensitive pattern matching', () => {
        const error = createAxiosError(401, 'INVALID TOTP CODE PROVIDED');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.INVALID_VERIFICATION_CODE);
      });
    });

    describe('Message pattern priority', () => {
      it('should prioritize backend message pattern over status code', () => {
        // 401 normally returns INVALID_CODE, but session message should take precedence
        const error = createAxiosError(401, 'MFA session not found or expired');
        const result = getErrorMessage(error);
        expect(result).toBe(MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION);
      });
    });
  });
});

/**
 * Tests for useRemoveMFA hook - 3-step MFA disable flow
 * Tests cover: initiate → verify code → confirm disable
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import axios from 'axios';

import { useRemoveMFA } from './useRemoveMFA';
import { MFA_DISABLE_ERROR_MESSAGES } from './RemoveMFA.constants';
import { mockMfaToken } from '../__mocks__/mfa.mocks';
import {
  setupMFATests,
  mockMFADisableInitiate,
  mockMFADisableVerifyCode,
  mockMFADisableConfirm,
  mockCustomError,
  mockNetworkFailure,
} from '../__tests__/helpers';

const mockConfirmationToken = 'mock-confirmation-token-abc';

describe('useRemoveMFA', () => {
  beforeEach(() => {
    setupMFATests();
  });

  describe('Initialization', () => {
    it('should initialize with null mfaToken', () => {
      const { result } = renderHook(() => useRemoveMFA());

      expect(result.current.mfaToken).toBeNull();
      expect(result.current.confirmationToken).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should not call API on mount', () => {
      renderHook(() => useRemoveMFA());

      expect(vi.mocked(axios.post)).not.toHaveBeenCalled();
    });
  });

  describe('Step 1: Initiate Disable', () => {
    it('should call initiateDisable API and set mfaToken', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      let response: Awaited<ReturnType<typeof result.current.initiateDisable>> | undefined;
      await act(async () => {
        response = await result.current.initiateDisable();
      });

      expect(response?.success).toBe(true);
      expect(response?.mfaToken).toBe(mockMfaToken);

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });
    });

    it('should set isLoading true during initiation', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      let promise;
      act(() => {
        promise = result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      await promise;
    });

    it('should clear error before initiation', async () => {
      const { result } = renderHook(() => useRemoveMFA());

      // First attempt - initiate with error
      mockCustomError(401, 'Invalid TOTP code');
      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      // Second initiate - should clear previous error
      mockMFADisableInitiate();
      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });

    it('should handle API error during initiation', async () => {
      mockCustomError(403, 'MFA is not enabled for this user');
      const { result } = renderHook(() => useRemoveMFA());

      let response: Awaited<ReturnType<typeof result.current.initiateDisable>> | undefined;
      await act(async () => {
        response = await result.current.initiateDisable();
      });

      expect(response?.success).toBe(false);
      expect(response?.mfaToken).toBeUndefined();

      await waitFor(() => {
        expect(result.current.mfaToken).toBeNull();
        expect(result.current.error).toBeTruthy();
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle network error during initiation', async () => {
      mockNetworkFailure();
      const { result } = renderHook(() => useRemoveMFA());

      let response: Awaited<ReturnType<typeof result.current.initiateDisable>> | undefined;
      await act(async () => {
        response = await result.current.initiateDisable();
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.NETWORK_ERROR);
      });
    });

    it('should call correct API endpoint', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
        '/users/me/mfa/totp/disable/initiate',
        {},
        expect.any(Object),
      );
    });
  });

  describe('Step 2: Verify Code', () => {
    it('should return error when mfaToken is null', async () => {
      const { result } = renderHook(() => useRemoveMFA());

      let response: Awaited<ReturnType<typeof result.current.verifyCode>> | undefined;
      await act(async () => {
        response = await result.current.verifyCode('123456');
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION);
      });

      expect(vi.mocked(axios.post)).not.toHaveBeenCalled();
    });

    it('should verify code and set confirmationToken', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      mockMFADisableVerifyCode(mockConfirmationToken);

      let response: Awaited<ReturnType<typeof result.current.verifyCode>> | undefined;
      await act(async () => {
        response = await result.current.verifyCode('123456');
      });

      expect(response?.success).toBe(true);

      await waitFor(() => {
        expect(result.current.confirmationToken).toBe(mockConfirmationToken);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should call verify API with correct parameters', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      mockMFADisableVerifyCode(mockConfirmationToken);

      await act(async () => {
        await result.current.verifyCode('123456');
      });

      expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
        '/users/me/mfa/totp/disable/verify',
        {
          mfaToken: mockMfaToken,
          code: '123456',
        },
        expect.any(Object),
      );
    });

    it('should set isLoading during verification', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      mockMFADisableVerifyCode(mockConfirmationToken);

      let promise: Promise<unknown> | undefined;
      act(() => {
        promise = result.current.verifyCode('123456');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      await promise;
    });

    it('should set isLoading false after successful verification', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      mockMFADisableVerifyCode(mockConfirmationToken);

      await act(async () => {
        await result.current.verifyCode('123456');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should clear error before verification', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      // First verification - error
      mockCustomError(401, 'Invalid TOTP code');
      await act(async () => {
        await result.current.verifyCode('000000');
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      // Second verification - should clear error
      mockMFADisableVerifyCode(mockConfirmationToken);
      await act(async () => {
        await result.current.verifyCode('123456');
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });

    it('should handle invalid code error', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      mockCustomError(401, 'Invalid TOTP code');

      let response: Awaited<ReturnType<typeof result.current.verifyCode>> | undefined;
      await act(async () => {
        response = await result.current.verifyCode('000000');
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.INVALID_VERIFICATION_CODE);
        expect(result.current.confirmationToken).toBeNull();
      });
    });

    it('should handle invalid recovery code error', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      mockCustomError(401, 'Invalid recovery code provided');

      let response: Awaited<ReturnType<typeof result.current.verifyCode>> | undefined;
      await act(async () => {
        response = await result.current.verifyCode('XXXXX-XXXXX');
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });

    it('should handle used recovery code error', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      mockCustomError(400, 'This recovery code has already been used');

      let response: Awaited<ReturnType<typeof result.current.verifyCode>> | undefined;
      await act(async () => {
        response = await result.current.verifyCode('ABCDE-12345');
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });

    it('should handle expired session error', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      mockCustomError(401, 'MFA session not found or expired');

      let response: Awaited<ReturnType<typeof result.current.verifyCode>> | undefined;
      await act(async () => {
        response = await result.current.verifyCode('123456');
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION);
      });
    });

    it('should handle too many attempts error', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      mockCustomError(429, 'Too many invalid TOTP attempts');

      let response: Awaited<ReturnType<typeof result.current.verifyCode>> | undefined;
      await act(async () => {
        response = await result.current.verifyCode('000000');
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.MAX_ATTEMPTS);
      });
    });

    it('should handle account lockout error', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      // Backend returns this specific message for account lockout
      mockCustomError(429, 'Account temporarily locked due to multiple failed MFA attempts');

      let response: Awaited<ReturnType<typeof result.current.verifyCode>> | undefined;
      await act(async () => {
        response = await result.current.verifyCode('123456');
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        // Parser should return the backend message directly for this 429 error
        expect(result.current.error).toBe(
          'Account temporarily locked due to multiple failed MFA attempts',
        );
      });
    });

    it('should handle network error during verification', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      mockNetworkFailure();

      let response: Awaited<ReturnType<typeof result.current.verifyCode>> | undefined;
      await act(async () => {
        response = await result.current.verifyCode('123456');
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.NETWORK_ERROR);
      });
    });
  });

  describe('Step 3: Confirm Disable', () => {
    it('should return error when confirmationToken is null', async () => {
      const { result } = renderHook(() => useRemoveMFA());

      let response: Awaited<ReturnType<typeof result.current.confirmDisable>> | undefined;
      await act(async () => {
        response = await result.current.confirmDisable();
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION);
      });
    });

    it('should confirm and disable MFA', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      mockMFADisableVerifyCode(mockConfirmationToken);

      await act(async () => {
        await result.current.verifyCode('123456');
      });

      await waitFor(() => {
        expect(result.current.confirmationToken).toBe(mockConfirmationToken);
      });

      mockMFADisableConfirm();

      let response: Awaited<ReturnType<typeof result.current.confirmDisable>> | undefined;
      await act(async () => {
        response = await result.current.confirmDisable();
      });

      expect(response?.success).toBe(true);
    });

    it('should call confirm API with correct parameters', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      mockMFADisableVerifyCode(mockConfirmationToken);

      await act(async () => {
        await result.current.verifyCode('123456');
      });

      mockMFADisableConfirm();

      await act(async () => {
        await result.current.confirmDisable();
      });

      expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
        '/users/me/mfa/totp/disable/confirm',
        {
          confirmationToken: mockConfirmationToken,
        },
        expect.any(Object),
      );
    });
  });

  describe('State Management', () => {
    it('should clear error when clearError is called', async () => {
      mockCustomError(401, 'Invalid code');
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.verifyCode('000000');
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should maintain mfaToken across multiple verify attempts', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      const initialToken = result.current.mfaToken;

      mockCustomError(401, 'Invalid TOTP code');
      await act(async () => {
        await result.current.verifyCode('000000');
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(initialToken);
        expect(result.current.error).toBeTruthy();
      });
    });

    it('should reset all state when resetSession is called', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      act(() => {
        result.current.resetSession();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBeNull();
        expect(result.current.confirmationToken).toBeNull();
        expect(result.current.error).toBeNull();
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle multiple verification attempts with different errors', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      // First attempt - invalid code
      mockCustomError(401, 'Invalid TOTP code');
      await act(async () => {
        await result.current.verifyCode('000000');
      });

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.INVALID_VERIFICATION_CODE);
      });

      // Second attempt - network error
      mockNetworkFailure();
      await act(async () => {
        await result.current.verifyCode('111111');
      });

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.NETWORK_ERROR);
      });
    });
  });

  describe('Loading States', () => {
    it('should handle loading state for complete flow', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      // Initiate
      let initiatePromise: Promise<unknown> | undefined;
      act(() => {
        initiatePromise = result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      await initiatePromise;

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verify
      mockMFADisableVerifyCode(mockConfirmationToken);

      let verifyPromise: Promise<unknown> | undefined;
      act(() => {
        verifyPromise = result.current.verifyCode('123456');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      await verifyPromise;

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle verify call without initiate', async () => {
      const { result } = renderHook(() => useRemoveMFA());

      let response: Awaited<ReturnType<typeof result.current.verifyCode>> | undefined;
      await act(async () => {
        response = await result.current.verifyCode('123456');
      });

      expect(response?.success).toBe(false);
      expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION);
    });

    it('should handle confirm call without verify', async () => {
      const { result } = renderHook(() => useRemoveMFA());

      let response: Awaited<ReturnType<typeof result.current.confirmDisable>> | undefined;
      await act(async () => {
        response = await result.current.confirmDisable();
      });

      expect(response?.success).toBe(false);
      expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION);
    });

    it('should handle empty verification code', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      mockCustomError(400, 'Code is required');

      let response: Awaited<ReturnType<typeof result.current.verifyCode>> | undefined;
      await act(async () => {
        response = await result.current.verifyCode('');
      });

      expect(response?.success).toBe(false);
    });

    it('should handle rapid successive calls', async () => {
      mockMFADisableInitiate();
      mockMFADisableInitiate();

      const { result } = renderHook(() => useRemoveMFA());

      const [result1, result2] = await act(async () =>
        Promise.all([result.current.initiateDisable(), result.current.initiateDisable()]),
      );

      expect(result1?.success).toBe(true);
      expect(result2?.success).toBe(true);
    });
  });
});

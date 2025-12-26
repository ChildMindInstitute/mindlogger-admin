// Tests for useRemoveMFA hook

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import axios from 'axios';

import { useRemoveMFA } from './useRemoveMFA';
import { MFA_DISABLE_ERROR_MESSAGES } from './RemoveMFA.constants';
import { mockMfaToken } from '../__mocks__/mfa.mocks';
import {
  setupMFATests,
  mockMFADisableInitiate,
  mockMFADisableVerify,
  mockCustomError,
  mockNetworkFailure,
} from '../__tests__/helpers';

describe('useRemoveMFA', () => {
  beforeEach(() => {
    setupMFATests();
  });

  describe('Initialization', () => {
    it('should initialize with null mfaToken', () => {
      const { result } = renderHook(() => useRemoveMFA());

      expect(result.current.mfaToken).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should not call API on mount', () => {
      renderHook(() => useRemoveMFA());

      expect(vi.mocked(axios.post)).not.toHaveBeenCalled();
    });
  });

  describe('Initiate Disable', () => {
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
      mockCustomError(401, 'Invalid TOTP code');
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

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
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.NOT_ENABLED);
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

  describe('Verify and Disable', () => {
    it('should return error when mfaToken is null', async () => {
      const { result } = renderHook(() => useRemoveMFA());

      let response: Awaited<ReturnType<typeof result.current.verifyAndDisable>> | undefined;
      await act(async () => {
        response = await result.current.verifyAndDisable('123456');
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION);
      });

      expect(vi.mocked(axios.post)).not.toHaveBeenCalled();
    });

    it('should verify and disable MFA with valid code', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      mockMFADisableVerify();

      let response: Awaited<ReturnType<typeof result.current.verifyAndDisable>> | undefined;
      await act(async () => {
        response = await result.current.verifyAndDisable('123456');
      });

      expect(response?.success).toBe(true);

      await waitFor(() => {
        expect(result.current.error).toBeNull();
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

      mockMFADisableVerify();

      await act(async () => {
        await result.current.verifyAndDisable('123456');
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

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      mockMFADisableVerify();

      let promise: Promise<unknown> | undefined;
      act(() => {
        promise = result.current.verifyAndDisable('123456');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      if (promise) {
        await promise;
      }
    });

    it('should set isLoading false after successful verification', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      mockMFADisableVerify();

      await act(async () => {
        await result.current.verifyAndDisable('123456');
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

      mockCustomError(401, 'Invalid TOTP code');
      await act(async () => {
        await result.current.verifyAndDisable('123456');
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      mockMFADisableVerify();
      await act(async () => {
        await result.current.verifyAndDisable('654321');
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

      mockCustomError(401, 'Invalid TOTP code provided');

      let response: Awaited<ReturnType<typeof result.current.verifyAndDisable>> | undefined;
      await act(async () => {
        response = await result.current.verifyAndDisable('000000');
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.INVALID_CODE);
        expect(result.current.isLoading).toBe(false);
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

      let response: Awaited<ReturnType<typeof result.current.verifyAndDisable>> | undefined;
      await act(async () => {
        response = await result.current.verifyAndDisable('ZZZZZ-99999');
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.RECOVERY_CODE_INVALID);
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

      let response: Awaited<ReturnType<typeof result.current.verifyAndDisable>> | undefined;
      await act(async () => {
        response = await result.current.verifyAndDisable('ABCDE-12345');
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.RECOVERY_CODE_USED);
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

      mockCustomError(404, 'MFA session not found or expired');

      let response: Awaited<ReturnType<typeof result.current.verifyAndDisable>> | undefined;
      await act(async () => {
        response = await result.current.verifyAndDisable('123456');
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

      mockCustomError(429, 'Too many invalid TOTP attempts. Try again later.');

      let response: Awaited<ReturnType<typeof result.current.verifyAndDisable>> | undefined;
      await act(async () => {
        response = await result.current.verifyAndDisable('123456');
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

      mockCustomError(429, 'Account temporarily locked due to multiple failed MFA attempts');

      let response: Awaited<ReturnType<typeof result.current.verifyAndDisable>> | undefined;
      await act(async () => {
        response = await result.current.verifyAndDisable('123456');
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.GLOBAL_LOCKOUT);
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

      let response: Awaited<ReturnType<typeof result.current.verifyAndDisable>> | undefined;
      await act(async () => {
        response = await result.current.verifyAndDisable('123456');
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.NETWORK_ERROR);
      });
    });
  });

  describe('State Management', () => {
    it('should clear error when clearError is called', async () => {
      mockCustomError(401, 'Invalid TOTP code');
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      act(() => {
        result.current.clearError();
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });

    it('should maintain mfaToken across multiple verify attempts', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      const initialToken = result.current.mfaToken;

      mockCustomError(401, 'Invalid TOTP code');
      await act(async () => {
        await result.current.verifyAndDisable('000000');
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(initialToken);
      });

      mockMFADisableVerify();
      await act(async () => {
        await result.current.verifyAndDisable('123456');
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(initialToken);
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

      mockCustomError(401, 'Invalid TOTP code');
      await act(async () => {
        await result.current.verifyAndDisable('000000');
      });

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.INVALID_CODE);
      });

      mockCustomError(401, 'Invalid recovery code provided');
      await act(async () => {
        await result.current.verifyAndDisable('ZZZZZ-99999');
      });

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.RECOVERY_CODE_INVALID);
      });
    });
  });

  describe('Loading States', () => {
    it('should handle loading state for complete flow', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      expect(result.current.isLoading).toBe(false);

      let initiatePromise: Promise<unknown> | undefined;
      act(() => {
        initiatePromise = result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      if (initiatePromise) {
        await initiatePromise;
      }

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      mockMFADisableVerify();

      let verifyPromise: Promise<unknown> | undefined;
      act(() => {
        verifyPromise = result.current.verifyAndDisable('123456');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      if (verifyPromise) {
        await verifyPromise;
      }

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle verify call without initiate', async () => {
      const { result } = renderHook(() => useRemoveMFA());

      let response: Awaited<ReturnType<typeof result.current.verifyAndDisable>> | undefined;
      await act(async () => {
        response = await result.current.verifyAndDisable('123456');
      });

      expect(response?.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION);
      });
    });

    it('should handle empty verification code', async () => {
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      await act(async () => {
        await result.current.initiateDisable();
      });

      await waitFor(() => {
        expect(result.current.mfaToken).toBe(mockMfaToken);
      });

      mockMFADisableVerify();
      let response: Awaited<ReturnType<typeof result.current.verifyAndDisable>> | undefined;
      await act(async () => {
        response = await result.current.verifyAndDisable('');
      });

      expect(response?.success).toBe(true);
    });

    it('should handle rapid successive calls', async () => {
      mockMFADisableInitiate();
      mockMFADisableInitiate();
      const { result } = renderHook(() => useRemoveMFA());

      let result1: Awaited<ReturnType<typeof result.current.initiateDisable>> | undefined;
      let result2: Awaited<ReturnType<typeof result.current.initiateDisable>> | undefined;

      await act(async () => {
        const promise1 = result.current.initiateDisable();
        const promise2 = result.current.initiateDisable();

        [result1, result2] = await Promise.all([promise1, promise2]);
      });

      expect(result1?.success).toBe(true);
      expect(result2?.success).toBe(true);
    });
  });
});

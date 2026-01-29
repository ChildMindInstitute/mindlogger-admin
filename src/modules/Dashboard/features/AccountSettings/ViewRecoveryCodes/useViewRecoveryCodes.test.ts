import { renderHook, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import { vi } from 'vitest';

import { useViewRecoveryCodes } from './useViewRecoveryCodes';
import { mockMfaToken, mockRecoveryCodesList, mockDownloadToken } from '../__mocks__/mfa.mocks';
import { mockMFAViewCodesInitiate, mockMFAViewCodesVerify } from '../__tests__/helpers';

describe('useViewRecoveryCodes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      expect(result.current.verificationCode).toBe('');
      expect(result.current.recoveryCode).toBe('');
      expect(result.current.recoveryCodes).toBeNull();
      expect(result.current.downloadToken).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('TOTP Verification Flow', () => {
    it('should successfully verify TOTP code and return recovery codes', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      // First initiate session
      mockMFAViewCodesInitiate(mockMfaToken);
      await act(async () => {
        await result.current.initiateSession();
      });

      // Then verify code
      mockMFAViewCodesVerify(mockRecoveryCodesList, mockDownloadToken);

      let verifyResult: Awaited<ReturnType<typeof result.current.handleVerifyCode>> | undefined;

      await act(async () => {
        verifyResult = await result.current.handleVerifyCode('123456');
      });

      await waitFor(() => {
        expect(verifyResult?.success).toBe(true);
      });

      expect(verifyResult?.recoveryCodes).toEqual(mockRecoveryCodesList);
      expect(vi.mocked(axios.post)).toHaveBeenCalledTimes(2);
      expect(vi.mocked(axios.post)).toHaveBeenNthCalledWith(
        1,
        '/users/me/mfa/recovery-codes/view/initiate',
        {},
        expect.any(Object),
      );
      expect(vi.mocked(axios.post)).toHaveBeenNthCalledWith(
        2,
        '/users/me/mfa/recovery-codes/view/verify',
        {
          mfaToken: mockMfaToken,
          code: '123456',
        },
        expect.any(Object),
      );
    });

    it('should set recovery codes and download token on success', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      // First initiate session
      mockMFAViewCodesInitiate(mockMfaToken);
      await act(async () => {
        await result.current.initiateSession();
      });

      // Then verify code
      mockMFAViewCodesVerify(mockRecoveryCodesList, mockDownloadToken);

      await act(async () => {
        await result.current.handleVerifyCode('123456');
      });

      await waitFor(() => {
        expect(result.current.recoveryCodes).toEqual(mockRecoveryCodesList);
      });

      expect(result.current.downloadToken).toBe(mockDownloadToken);
      expect(result.current.error).toBeNull();
    });

    it('should handle invalid TOTP code (400)', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      // First initiate session
      mockMFAViewCodesInitiate(mockMfaToken);
      await act(async () => {
        await result.current.initiateSession();
      });

      // Mock verification to fail
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 401,
          data: {
            result: [{ message: 'Invalid code' }],
          },
        },
      });

      let verifyResult: Awaited<ReturnType<typeof result.current.handleVerifyCode>> | undefined;

      await act(async () => {
        verifyResult = await result.current.handleVerifyCode('000000');
      });

      await waitFor(() => {
        expect(verifyResult?.success).toBe(false);
      });

      expect(result.current.error).toBe('invalidMFACode');
    });

    it('should handle MFA not enabled error (403)', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      // Mock initiate to fail with MFA not enabled
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 403,
          data: {
            result: [{ message: 'MFA not enabled' }],
          },
        },
      });

      let initiateResult: Awaited<ReturnType<typeof result.current.initiateSession>> | undefined;

      await act(async () => {
        initiateResult = await result.current.initiateSession();
      });

      await waitFor(() => {
        expect(initiateResult?.success).toBe(false);
      });

      expect(result.current.error).toBe(
        'Two-factor authentication is not enabled on this account.',
      );
    });

    it('should handle no recovery codes found (404)', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      // Mock initiate to fail with no recovery codes
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 404,
          data: {
            result: [{ message: 'No recovery codes found' }],
          },
        },
      });

      let initiateResult: Awaited<ReturnType<typeof result.current.initiateSession>> | undefined;

      await act(async () => {
        initiateResult = await result.current.initiateSession();
      });

      await waitFor(() => {
        expect(initiateResult?.success).toBe(false);
      });

      expect(result.current.error).toBe(
        'Two-factor authentication is not enabled on this account.',
      );
    });
  });

  describe('Recovery Code Verification Flow', () => {
    it('should successfully verify recovery code and return recovery codes', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      // First initiate session
      mockMFAViewCodesInitiate(mockMfaToken);
      await act(async () => {
        await result.current.initiateSession();
      });

      // Then verify recovery code
      mockMFAViewCodesVerify(mockRecoveryCodesList, mockDownloadToken);

      let verifyResult:
        | Awaited<ReturnType<typeof result.current.handleVerifyRecoveryCode>>
        | undefined;

      await act(async () => {
        verifyResult = await result.current.handleVerifyRecoveryCode('ABCDE-12345');
      });

      await waitFor(() => {
        expect(verifyResult?.success).toBe(true);
      });

      expect(verifyResult?.recoveryCodes).toEqual(mockRecoveryCodesList);
      expect(result.current.recoveryCodes).toEqual(mockRecoveryCodesList);
      expect(result.current.downloadToken).toBe(mockDownloadToken);
    });

    it('should handle invalid recovery code (400)', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      // First initiate session
      mockMFAViewCodesInitiate(mockMfaToken);
      await act(async () => {
        await result.current.initiateSession();
      });

      // Mock verification to fail
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 401,
          data: {
            result: [{ message: 'Invalid recovery code' }],
          },
        },
      });

      let verifyResult:
        | Awaited<ReturnType<typeof result.current.handleVerifyRecoveryCode>>
        | undefined;

      await act(async () => {
        verifyResult = await result.current.handleVerifyRecoveryCode('INVALID-CODE');
      });

      await waitFor(() => {
        expect(verifyResult?.success).toBe(false);
      });

      expect(result.current.error).toBe('invalidRecoveryCode');
    });

    it('should handle rate limiting (429)', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      // First initiate session
      mockMFAViewCodesInitiate(mockMfaToken);
      await act(async () => {
        await result.current.initiateSession();
      });

      // Mock verification to fail with rate limit
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 429,
          data: {
            result: [{ message: 'Too many invalid attempts' }],
          },
        },
      });

      let verifyResult:
        | Awaited<ReturnType<typeof result.current.handleVerifyRecoveryCode>>
        | undefined;

      await act(async () => {
        verifyResult = await result.current.handleVerifyRecoveryCode('ABCDE-12345');
      });

      await waitFor(() => {
        expect(verifyResult?.success).toBe(false);
      });

      expect(result.current.error).toBe('tooManyAttempts');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing mfaToken from initiate call', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      // Mock initiate to return empty result (missing mfaToken)
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          result: {},
        },
      });

      let initiateResult: Awaited<ReturnType<typeof result.current.initiateSession>> | undefined;

      await act(async () => {
        initiateResult = await result.current.initiateSession();
      });

      await waitFor(() => {
        expect(initiateResult?.success).toBe(false);
      });

      expect(result.current.error).toBe('networkError');
    });

    it('should handle missing codes from verify response', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      // First initiate session
      mockMFAViewCodesInitiate(mockMfaToken);
      await act(async () => {
        await result.current.initiateSession();
      });

      // Mock verification to return incomplete data (missing codes)
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          result: {
            downloadToken: mockDownloadToken,
          },
        },
      });

      let verifyResult: Awaited<ReturnType<typeof result.current.handleVerifyCode>> | undefined;

      await act(async () => {
        verifyResult = await result.current.handleVerifyCode('123456');
      });

      await waitFor(() => {
        expect(verifyResult?.success).toBe(false);
      });

      expect(result.current.error).toBe('networkError');
    });

    it('should handle network errors', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      // Mock initiate to fail with network error
      vi.mocked(axios.post).mockRejectedValueOnce({
        code: 'ERR_NETWORK',
        message: 'Network Error',
      });

      let initiateResult: Awaited<ReturnType<typeof result.current.initiateSession>> | undefined;

      await act(async () => {
        initiateResult = await result.current.initiateSession();
      });

      await waitFor(() => {
        expect(initiateResult?.success).toBe(false);
      });

      expect(result.current.error).toBe('networkError');
    });
  });

  describe('State Management', () => {
    it('should clear error when clearError is called', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      // First initiate session
      mockMFAViewCodesInitiate(mockMfaToken);
      await act(async () => {
        await result.current.initiateSession();
      });

      // Mock verification to fail
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 401,
          data: {
            result: [{ message: 'Invalid code' }],
          },
        },
      });

      await act(async () => {
        await result.current.handleVerifyCode('000000');
      });

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should set loading states correctly during verification', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      // First initiate session
      mockMFAViewCodesInitiate(mockMfaToken);
      await act(async () => {
        await result.current.initiateSession();
      });

      // Then verify code
      mockMFAViewCodesVerify(mockRecoveryCodesList, mockDownloadToken);

      expect(result.current.isLoading).toBe(false);

      await act(async () => {
        await result.current.handleVerifyCode('123456');
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid successive calls correctly', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      // First initiate session
      mockMFAViewCodesInitiate(mockMfaToken);
      await act(async () => {
        await result.current.initiateSession();
      });

      // Set up mocks for two verify calls
      mockMFAViewCodesVerify(mockRecoveryCodesList, mockDownloadToken);
      mockMFAViewCodesVerify(mockRecoveryCodesList, mockDownloadToken);

      await act(async () => {
        await result.current.handleVerifyCode('123456');
        await result.current.handleVerifyCode('654321');
      });

      await waitFor(() => {
        expect(result.current.recoveryCodes).toEqual(mockRecoveryCodesList);
      });

      expect(vi.mocked(axios.post)).toHaveBeenCalledTimes(3); // 1 initiate + 2 verify
    });

    it('should differentiate error messages between TOTP and recovery code', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      // First initiate session for TOTP code test
      mockMFAViewCodesInitiate(mockMfaToken);

      await act(async () => {
        await result.current.initiateSession();
      });

      // Wait for session to be initialized
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Mock the verify call to fail with 401 (invalid code)
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 401,
          data: {
            result: [{ message: 'Invalid' }],
          },
        },
      });

      await act(async () => {
        await result.current.handleVerifyCode('000000');
      });

      await waitFor(() => {
        expect(result.current.error).toBe('invalidMFACode');
      });

      // Clear error before next test
      act(() => {
        result.current.clearError();
      });

      // Mock the verify call to fail with recovery code (401)
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 401,
          data: {
            result: [{ message: 'Invalid' }],
          },
        },
      });

      await act(async () => {
        await result.current.handleVerifyRecoveryCode('INVALID-CODE');
      });

      await waitFor(() => {
        expect(result.current.error).toBe('invalidRecoveryCode');
      });
    });
  });
});

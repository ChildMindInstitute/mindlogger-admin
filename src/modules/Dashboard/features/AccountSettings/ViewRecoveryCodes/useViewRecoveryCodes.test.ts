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
      mockMFAViewCodesInitiate(mockMfaToken);
      mockMFAViewCodesVerify(mockRecoveryCodesList, mockDownloadToken);

      const { result } = renderHook(() => useViewRecoveryCodes());

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
      mockMFAViewCodesInitiate(mockMfaToken);
      mockMFAViewCodesVerify(mockRecoveryCodesList, mockDownloadToken);

      const { result } = renderHook(() => useViewRecoveryCodes());

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
      mockMFAViewCodesInitiate(mockMfaToken);
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            result: [{ message: 'Invalid code' }],
          },
        },
      });

      const { result } = renderHook(() => useViewRecoveryCodes());

      let verifyResult: Awaited<ReturnType<typeof result.current.handleVerifyCode>> | undefined;

      await act(async () => {
        verifyResult = await result.current.handleVerifyCode('000000');
      });

      await waitFor(() => {
        expect(verifyResult?.success).toBe(false);
      });

      expect(result.current.error).toBe('Invalid verification code. Please try again.');
    });

    it('should handle MFA not enabled error (403)', async () => {
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 403,
          data: {
            result: [{ message: 'MFA not enabled' }],
          },
        },
      });

      const { result } = renderHook(() => useViewRecoveryCodes());

      let verifyResult: Awaited<ReturnType<typeof result.current.handleVerifyCode>> | undefined;

      await act(async () => {
        verifyResult = await result.current.handleVerifyCode('123456');
      });

      await waitFor(() => {
        expect(verifyResult?.success).toBe(false);
      });

      expect(result.current.error).toBe('MFA is not enabled for your account.');
    });

    it('should handle no recovery codes found (404)', async () => {
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 404,
          data: {
            result: [{ message: 'No recovery codes found' }],
          },
        },
      });

      const { result } = renderHook(() => useViewRecoveryCodes());

      let verifyResult: Awaited<ReturnType<typeof result.current.handleVerifyCode>> | undefined;

      await act(async () => {
        verifyResult = await result.current.handleVerifyCode('123456');
      });

      await waitFor(() => {
        expect(verifyResult?.success).toBe(false);
      });

      expect(result.current.error).toBe('No recovery codes found. Please set up MFA first.');
    });
  });

  describe('Recovery Code Verification Flow', () => {
    it('should successfully verify recovery code and return recovery codes', async () => {
      mockMFAViewCodesInitiate(mockMfaToken);
      mockMFAViewCodesVerify(mockRecoveryCodesList, mockDownloadToken);

      const { result } = renderHook(() => useViewRecoveryCodes());

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
      mockMFAViewCodesInitiate(mockMfaToken);
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            result: [{ message: 'Invalid recovery code' }],
          },
        },
      });

      const { result } = renderHook(() => useViewRecoveryCodes());

      let verifyResult:
        | Awaited<ReturnType<typeof result.current.handleVerifyRecoveryCode>>
        | undefined;

      await act(async () => {
        verifyResult = await result.current.handleVerifyRecoveryCode('INVALID-CODE');
      });

      await waitFor(() => {
        expect(verifyResult?.success).toBe(false);
      });

      expect(result.current.error).toBe('Invalid recovery code. Please try again.');
    });

    it('should handle rate limiting (429)', async () => {
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 429,
          data: {
            result: [{ message: 'Too many attempts' }],
          },
        },
      });

      const { result } = renderHook(() => useViewRecoveryCodes());

      let verifyResult:
        | Awaited<ReturnType<typeof result.current.handleVerifyRecoveryCode>>
        | undefined;

      await act(async () => {
        verifyResult = await result.current.handleVerifyRecoveryCode('ABCDE-12345');
      });

      await waitFor(() => {
        expect(verifyResult?.success).toBe(false);
      });

      expect(result.current.error).toBe('Too many attempts. Please try again later.');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing mfaToken from initiate call', async () => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          result: {},
        },
      });

      const { result } = renderHook(() => useViewRecoveryCodes());

      let verifyResult: Awaited<ReturnType<typeof result.current.handleVerifyCode>> | undefined;

      await act(async () => {
        verifyResult = await result.current.handleVerifyCode('123456');
      });

      await waitFor(() => {
        expect(verifyResult?.success).toBe(false);
      });

      expect(result.current.error).toBe('An error occurred. Please try again.');
    });

    it('should handle missing codes from verify response', async () => {
      mockMFAViewCodesInitiate(mockMfaToken);
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          result: {
            downloadToken: mockDownloadToken,
          },
        },
      });

      const { result } = renderHook(() => useViewRecoveryCodes());

      let verifyResult: Awaited<ReturnType<typeof result.current.handleVerifyCode>> | undefined;

      await act(async () => {
        verifyResult = await result.current.handleVerifyCode('123456');
      });

      await waitFor(() => {
        expect(verifyResult?.success).toBe(false);
      });

      expect(result.current.error).toBe('An error occurred. Please try again.');
    });

    it('should handle network errors', async () => {
      vi.mocked(axios.post).mockRejectedValueOnce({
        code: 'ERR_NETWORK',
        message: 'Network Error',
      });

      const { result } = renderHook(() => useViewRecoveryCodes());

      let verifyResult: Awaited<ReturnType<typeof result.current.handleVerifyCode>> | undefined;

      await act(async () => {
        verifyResult = await result.current.handleVerifyCode('123456');
      });

      await waitFor(() => {
        expect(verifyResult?.success).toBe(false);
      });

      expect(result.current.error).toBe(
        'Network error. Please check your connection and try again.',
      );
    });
  });

  describe('State Management', () => {
    it('should clear error when clearError is called', async () => {
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            result: [{ message: 'Invalid code' }],
          },
        },
      });

      const { result } = renderHook(() => useViewRecoveryCodes());

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

      mockMFAViewCodesInitiate(mockMfaToken);
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

      mockMFAViewCodesInitiate(mockMfaToken);
      mockMFAViewCodesVerify(mockRecoveryCodesList, mockDownloadToken);
      mockMFAViewCodesInitiate(mockMfaToken);
      mockMFAViewCodesVerify(mockRecoveryCodesList, mockDownloadToken);

      await act(async () => {
        await result.current.handleVerifyCode('123456');
        await result.current.handleVerifyCode('654321');
      });

      await waitFor(() => {
        expect(result.current.recoveryCodes).toEqual(mockRecoveryCodesList);
      });

      expect(vi.mocked(axios.post)).toHaveBeenCalledTimes(4);
    });

    it('should differentiate error messages between TOTP and recovery code', async () => {
      const { result } = renderHook(() => useViewRecoveryCodes());

      mockMFAViewCodesInitiate(mockMfaToken);
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            result: [{ message: 'Invalid' }],
          },
        },
      });

      await act(async () => {
        await result.current.handleVerifyCode('000000');
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Invalid verification code. Please try again.');
      });

      mockMFAViewCodesInitiate(mockMfaToken);
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            result: [{ message: 'Invalid' }],
          },
        },
      });

      await act(async () => {
        await result.current.handleVerifyRecoveryCode('INVALID-CODE');
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Invalid recovery code. Please try again.');
      });
    });
  });
});

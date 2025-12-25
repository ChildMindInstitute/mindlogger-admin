// Tests for useMFASetup hook

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';

import { useMFASetup } from './useMFASetup';
import { MFA_ERROR_MESSAGES } from './MFASetup.const';
import {
  mockProvisioningUri,
  mockSecretKey,
  mockRecoveryCodes,
  mockDownloadToken,
  mockInvalidCodeError,
  mockExpiredSetupError,
  mockAlreadyEnabledError,
  mockSetupNotFoundError,
  mockNetworkError,
} from '../__mocks__/mfa.mocks';
import { setupMFATests, mockMFAInitiateSuccess, mockMFAVerifySuccess } from '../__tests__/helpers';

describe('useMFASetup', () => {
  beforeEach(() => {
    setupMFATests();
  });

  describe('Initialization', () => {
    it('should initialize with default state when modal is closed', () => {
      const { result } = renderHook(() => useMFASetup(false));

      expect(result.current.provisioningUri).toBeNull();
      expect(result.current.verificationCode).toBe('');
      expect(result.current.secretKey).toBe('');
      expect(result.current.downloadToken).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should not call API when isOpen is false', () => {
      renderHook(() => useMFASetup(false));

      expect(vi.mocked(axios.post)).not.toHaveBeenCalled();
    });

    it('should call initiateSetup API when isOpen becomes true', async () => {
      mockMFAInitiateSuccess();

      const { result } = renderHook(() => useMFASetup(true));

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
        '/users/me/mfa/totp/initiate',
        {},
        expect.any(Object),
      );
    });
  });

  describe('Setup Initiation Success', () => {
    it('should set provisioningUri on successful API call', async () => {
      mockMFAInitiateSuccess();

      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBe(mockProvisioningUri);
      });

      expect(result.current.error).toBeNull();
    });

    it('should extract and set secretKey from provisioning URI', async () => {
      mockMFAInitiateSuccess();

      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.secretKey).toBe(mockSecretKey);
      });
    });

    it('should handle provisioning URI without secret gracefully', async () => {
      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          result: {
            provisioningUri: 'otpauth://totp/MindLogger:test@example.com?issuer=MindLogger',
            message: 'Setup initiated',
          },
        },
      });

      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      expect(result.current.secretKey).toBe('');
    });

    it('should set isLoading to false after successful initiation', async () => {
      mockMFAInitiateSuccess();

      const { result } = renderHook(() => useMFASetup(true));

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('Verification Flow', () => {
    it('should verify code successfully and return recovery codes', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('123456');
      });

      await waitFor(() => {
        expect(result.current.verificationCode).toBe('123456');
      });

      mockMFAVerifySuccess();

      const verifyResult = await result.current.handleVerify();

      expect(verifyResult.success).toBe(true);
      expect(verifyResult.recoveryCodes).toEqual(mockRecoveryCodes);
      expect(verifyResult.downloadToken).toBe(mockDownloadToken);

      await waitFor(() => {
        expect(result.current.downloadToken).toBe(mockDownloadToken);
      });

      expect(result.current.error).toBeNull();
    });

    it('should handle successful verification with null downloadToken', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('123456');
      });

      await waitFor(() => {
        expect(result.current.verificationCode).toBe('123456');
      });

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          result: {
            mfaEnabled: true,
            recoveryCodes: mockRecoveryCodes,
            downloadToken: null,
            message: 'MFA enabled',
          },
        },
      });

      const verifyResult = await result.current.handleVerify();

      expect(verifyResult.success).toBe(true);
      expect(verifyResult.downloadToken).toBeNull();
      expect(result.current.downloadToken).toBeNull();
    });

    it('should reject verification with empty code', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('');
      });

      const verifyResult = await result.current.handleVerify();

      expect(verifyResult.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.INVALID_CODE);
      });

      expect(vi.mocked(axios.post)).toHaveBeenCalledTimes(1); // Only initiate, no verify
    });

    it('should reject verification with code length less than 6', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('12345');
      });

      const verifyResult = await result.current.handleVerify();

      expect(verifyResult.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.INVALID_CODE);
      });
    });

    it('should reject verification with code length greater than 6', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('1234567');
      });

      const verifyResult = await result.current.handleVerify();

      expect(verifyResult.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.INVALID_CODE);
      });
    });

    it('should call verify API with correct code when length is valid', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('123456');
      });

      await waitFor(() => {
        expect(result.current.verificationCode).toBe('123456');
      });

      mockMFAVerifySuccess();

      await result.current.handleVerify();

      expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
        '/users/me/mfa/totp/verify',
        { code: '123456' },
        expect.any(Object),
      );
    });

    it('should set isLoading during verification', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('123456');
      });

      await waitFor(() => {
        expect(result.current.verificationCode).toBe('123456');
      });

      vi.mocked(axios.post).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                data: {
                  result: {
                    mfaEnabled: true,
                    recoveryCodes: mockRecoveryCodes,
                    downloadToken: mockDownloadToken,
                  },
                },
              });
            }, 100);
          }),
      );

      let verifyPromise: Promise<unknown> | undefined;

      act(() => {
        verifyPromise = result.current.handleVerify();
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

    it('should return false when mfaEnabled is false in response', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('123456');
      });

      await waitFor(() => {
        expect(result.current.verificationCode).toBe('123456');
      });

      vi.mocked(axios.post).mockResolvedValueOnce({
        data: {
          result: {
            mfaEnabled: false,
            message: 'Verification failed',
          },
        },
      });

      const verifyResult = await result.current.handleVerify();

      expect(verifyResult.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.INVALID_CODE);
      });
    });
  });

  describe('Error Handling - Initiation', () => {
    it('should handle already enabled error (409)', async () => {
      vi.mocked(axios.post).mockRejectedValueOnce(mockAlreadyEnabledError);

      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.ALREADY_ENABLED);
      });

      expect(result.current.provisioningUri).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle setup not found error (404)', async () => {
      vi.mocked(axios.post).mockRejectedValueOnce(mockSetupNotFoundError);

      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.SETUP_NOT_FOUND);
      });
    });

    it('should handle network error', async () => {
      vi.mocked(axios.post).mockRejectedValueOnce(mockNetworkError);

      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.NETWORK_ERROR);
      });
    });

    it('should handle unknown error with fallback message', async () => {
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 500,
          data: {
            result: [{ message: 'Internal server error' }],
          },
        },
      });

      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.UNKNOWN_ERROR);
      });
    });

    it('should match backend error pattern for already enabled', async () => {
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            result: [{ message: 'MFA is already enabled for this account' }],
          },
        },
      });

      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.ALREADY_ENABLED);
      });
    });

    it('should match backend error pattern for expired setup', async () => {
      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            result: [{ message: 'Setup session has expired' }],
          },
        },
      });

      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.EXPIRED_SETUP);
      });
    });
  });

  describe('Error Handling - Verification', () => {
    it('should handle invalid code error during verification', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('123456');
      });

      await waitFor(() => {
        expect(result.current.verificationCode).toBe('123456');
      });

      vi.mocked(axios.post).mockRejectedValueOnce(mockInvalidCodeError);

      const verifyResult = await result.current.handleVerify();

      expect(verifyResult.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.INVALID_CODE);
      });
    });

    it('should handle expired setup error during verification', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('123456');
      });

      await waitFor(() => {
        expect(result.current.verificationCode).toBe('123456');
      });

      vi.mocked(axios.post).mockRejectedValueOnce(mockExpiredSetupError);

      const verifyResult = await result.current.handleVerify();

      expect(verifyResult.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.EXPIRED_SETUP);
      });
    });

    it('should handle setup not found during verification', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('123456');
      });

      await waitFor(() => {
        expect(result.current.verificationCode).toBe('123456');
      });

      vi.mocked(axios.post).mockRejectedValueOnce(mockSetupNotFoundError);

      const verifyResult = await result.current.handleVerify();

      expect(verifyResult.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.SETUP_NOT_FOUND);
      });
    });

    it('should match backend invalid TOTP code pattern', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('123456');
      });

      await waitFor(() => {
        expect(result.current.verificationCode).toBe('123456');
      });

      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 401,
          data: {
            result: [{ message: 'Invalid TOTP code provided' }],
          },
        },
      });

      const verifyResult = await result.current.handleVerify();

      expect(verifyResult.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.INVALID_CODE);
      });
    });

    it('should fallback to status code 400 for invalid code', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('123456');
      });

      await waitFor(() => {
        expect(result.current.verificationCode).toBe('123456');
      });

      vi.mocked(axios.post).mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            result: [{ message: 'Bad request' }],
          },
        },
      });

      const verifyResult = await result.current.handleVerify();

      expect(verifyResult.success).toBe(false);

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.INVALID_CODE);
      });
    });
  });

  describe('State Management', () => {
    it('should update verificationCode when setVerificationCode is called', async () => {
      const { result } = renderHook(() => useMFASetup(false));

      act(() => {
        result.current.setVerificationCode('123456');
      });

      await waitFor(() => {
        expect(result.current.verificationCode).toBe('123456');
      });
    });

    it('should clear error when clearError is called', async () => {
      vi.mocked(axios.post).mockRejectedValueOnce(mockNetworkError);

      const { result } = renderHook(() => useMFASetup(true));

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

    it('should reset state when modal closes (isOpen becomes false)', async () => {
      mockMFAInitiateSuccess();

      const { result, rerender } = renderHook(({ isOpen }) => useMFASetup(isOpen), {
        initialProps: { isOpen: true },
      });

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('123456');
      });

      rerender({ isOpen: false });

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeNull();
        expect(result.current.verificationCode).toBe('');
        expect(result.current.secretKey).toBe('');
        expect(result.current.error).toBeNull();
      });
    });

    it('should clear error when initiating new setup', async () => {
      const { result, rerender } = renderHook(({ isOpen }) => useMFASetup(isOpen), {
        initialProps: { isOpen: false },
      });

      act(() => {
        result.current.setVerificationCode('12345');
      });

      await result.current.handleVerify();

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.INVALID_CODE);
      });

      mockMFAInitiateSuccess();
      rerender({ isOpen: true });

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      expect(result.current.error).toBeNull();
    });

    it('should clear error when starting verification', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('12345');
      });

      await result.current.handleVerify();

      await waitFor(() => {
        expect(result.current.error).toBe(MFA_ERROR_MESSAGES.INVALID_CODE);
      });

      act(() => {
        result.current.setVerificationCode('123456');
      });

      await waitFor(() => {
        expect(result.current.verificationCode).toBe('123456');
      });

      mockMFAVerifySuccess();

      await result.current.handleVerify();

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('Loading States', () => {
    it('should set isLoading true during initiation', () => {
      mockMFAInitiateSuccess();

      const { result } = renderHook(() => useMFASetup(true));

      expect(result.current.isLoading).toBe(true);
    });

    it('should set isLoading false after successful initiation', async () => {
      mockMFAInitiateSuccess();

      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should set isLoading false after failed initiation', async () => {
      vi.mocked(axios.post).mockRejectedValueOnce(mockNetworkError);

      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
    });

    it('should set isLoading true during verification', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('123456');
      });

      await waitFor(() => {
        expect(result.current.verificationCode).toBe('123456');
      });

      vi.mocked(axios.post).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                data: {
                  result: {
                    mfaEnabled: true,
                    recoveryCodes: mockRecoveryCodes,
                    downloadToken: mockDownloadToken,
                  },
                },
              });
            }, 100);
          }),
      );

      let verifyPromise: Promise<unknown> | undefined;

      act(() => {
        verifyPromise = result.current.handleVerify();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      if (verifyPromise) {
        await verifyPromise;
      }
    });

    it('should set isLoading false after successful verification', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('123456');
      });

      await waitFor(() => {
        expect(result.current.verificationCode).toBe('123456');
      });

      mockMFAVerifySuccess();

      await result.current.handleVerify();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should set isLoading false after failed verification', async () => {
      mockMFAInitiateSuccess();
      const { result } = renderHook(() => useMFASetup(true));

      await waitFor(() => {
        expect(result.current.provisioningUri).toBeTruthy();
      });

      act(() => {
        result.current.setVerificationCode('123456');
      });

      await waitFor(() => {
        expect(result.current.verificationCode).toBe('123456');
      });

      vi.mocked(axios.post).mockRejectedValueOnce(mockInvalidCodeError);

      await result.current.handleVerify();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });
});

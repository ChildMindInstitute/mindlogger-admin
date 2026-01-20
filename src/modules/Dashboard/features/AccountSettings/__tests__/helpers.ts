/**
 * Test helper functions for MFA tests
 * These utilities reduce duplication and make tests more readable
 */

import { vi } from 'vitest';
import axios from 'axios';

import {
  mockMFAInitiateResponse,
  mockMFAVerifyResponse,
  mockRecoveryCodesListResponse,
  mockMFADisableInitiateResponse,
  mockMFADisableVerifyResponse,
  mockViewRecoveryCodesInitiateResponse,
  mockDownloadResponse,
  mockInvalidCodeError,
  mockExpiredSetupError,
  mockAlreadyEnabledError,
  mockSetupNotFoundError,
  mockNetworkError,
} from '../__mocks__/mfa.mocks';

/**
 * Sets up common mocks for all MFA tests
 * Call this in beforeEach to ensure clean state
 */
export const setupMFATests = () => {
  // Reset all mocks completely (clears both call history AND implementations)
  vi.resetAllMocks();
};

/**
 * Mock successful MFA setup initiation
 * Simulates backend returning provisioning URI and secret
 */
export const mockMFAInitiateSuccess = () => {
  vi.mocked(axios.post).mockResolvedValueOnce(mockMFAInitiateResponse);
};

/**
 * Mock successful MFA verification
 * @param recoveryCodes - Optional custom recovery codes
 * @param downloadToken - Optional custom download token
 */
export const mockMFAVerifySuccess = (recoveryCodes?: string[], downloadToken?: string) => {
  const response = {
    ...mockMFAVerifyResponse,
    data: {
      result: {
        ...mockMFAVerifyResponse.data.result,
        ...(recoveryCodes && { recoveryCodes }),
        ...(downloadToken && { downloadToken }),
      },
    },
  };
  vi.mocked(axios.post).mockResolvedValueOnce(response);
};

/**
 * Mock MFA status check
 * @param enabled - Whether MFA is enabled
 */
export const mockMFAStatus = (enabled: boolean) => {
  const response = {
    data: {
      result: {
        mfaEnabled: enabled,
      },
    },
  };
  vi.mocked(axios.get).mockResolvedValueOnce(response);
};

/**
 * Mock viewing recovery codes initiation
 * Returns mfaToken for verification step
 */
export const mockViewRecoveryCodesInitiate = () => {
  vi.mocked(axios.post).mockResolvedValueOnce(mockViewRecoveryCodesInitiateResponse);
};

/**
 * Mock viewing recovery codes verification
 * Returns the list of recovery codes
 */
export const mockViewRecoveryCodesVerify = () => {
  vi.mocked(axios.post).mockResolvedValueOnce(mockRecoveryCodesListResponse);
};

/**
 * Mock successful recovery codes download
 * Simulates file download response
 */
export const mockRecoveryCodesDownload = () => {
  vi.mocked(axios.get).mockResolvedValueOnce(mockDownloadResponse);
};

/**
 * Mock MFA disable initiation
 * Returns mfaToken for verification step
 */
export const mockMFADisableInitiate = () => {
  vi.mocked(axios.post).mockResolvedValueOnce(mockMFADisableInitiateResponse);
};

/**
 * Mock MFA disable code verification (Step 2 of 3-step flow)
 * Returns confirmationToken for the final disable step
 */
export const mockMFADisableVerifyCode = (
  confirmationToken: string = 'mock-confirmation-token-abc',
) => {
  vi.mocked(axios.post).mockResolvedValueOnce({
    data: {
      result: {
        codeValidated: true,
        confirmationToken,
      },
    },
  });
};

/**
 * Mock MFA disable confirmation (Step 3 of 3-step flow)
 * Completes the disable operation
 */
export const mockMFADisableConfirm = () => {
  vi.mocked(axios.post).mockResolvedValueOnce({
    data: {
      result: {
        mfaDisabled: true,
      },
    },
  });
};

/**
 * Mock MFA disable verification (Legacy - kept for backward compatibility)
 * Completes the disable operation
 */
export const mockMFADisableVerify = () => {
  vi.mocked(axios.post).mockResolvedValueOnce(mockMFADisableVerifyResponse);
};

/**
 * Mock invalid verification code error
 * Simulates 400 Bad Request
 */
export const mockInvalidCode = () => {
  vi.mocked(axios.post).mockRejectedValueOnce(mockInvalidCodeError);
};

/**
 * Mock expired setup error
 * Simulates 410 Gone - setup session expired
 */
export const mockExpiredSetup = () => {
  vi.mocked(axios.post).mockRejectedValueOnce(mockExpiredSetupError);
};

/**
 * Mock already enabled error
 * Simulates 409 Conflict - MFA already active
 */
export const mockAlreadyEnabled = () => {
  vi.mocked(axios.post).mockRejectedValueOnce(mockAlreadyEnabledError);
};

/**
 * Mock setup not found error
 * Simulates 404 Not Found - no pending setup
 */
export const mockSetupNotFound = () => {
  vi.mocked(axios.post).mockRejectedValueOnce(mockSetupNotFoundError);
};

/**
 * Mock network error
 * Simulates connection failure
 */
export const mockNetworkFailure = () => {
  vi.mocked(axios.post).mockRejectedValueOnce(mockNetworkError);
};

/**
 * Mock custom API error
 * @param status - HTTP status code
 * @param message - Error message
 */
export const mockCustomError = (status: number, message: string) => {
  vi.mocked(axios.post).mockRejectedValueOnce({
    response: {
      status,
      data: {
        result: [{ message }],
      },
    },
  });
};

/**
 * Wait for async state updates
 * Useful for testing loading states
 */
export const waitForLoadingToFinish = async () => {
  // Small delay to allow state updates to propagate
  await new Promise((resolve) => setTimeout(resolve, 0));
};

/**
 * Create mock handlers for component callbacks
 * Returns object with all common callback mocks
 */
export const createMockHandlers = () => ({
  onClose: vi.fn(),
  onComplete: vi.fn(),
  onSuccess: vi.fn(),
  onError: vi.fn(),
  onBack: vi.fn(),
  onConfirm: vi.fn(),
});

/**
 * Verify axios was called with correct endpoint and data
 * @param method - HTTP method (post, get, etc.)
 * @param endpoint - API endpoint path
 * @param data - Optional request body
 */
export const verifyApiCall = (
  method: 'post' | 'get' | 'delete' | 'put',
  endpoint: string,
  data?: unknown,
) => {
  const axiosMethod = vi.mocked(axios[method]);

  if (data !== undefined) {
    expect(axiosMethod).toHaveBeenCalledWith(endpoint, data, expect.any(Object));
  } else {
    expect(axiosMethod).toHaveBeenCalledWith(expect.stringContaining(endpoint), expect.any(Object));
  }
};

/**
 * Setup feature flag mock for MFA
 * @param _enabled - Whether MFA feature flag is enabled
 */
export const mockMFAFeatureFlag = (_enabled: boolean) => {
  // This would be used if we need to override the global mock
  // For now, the global mock in setupTests.ts sets enableMfa: false by default
  // Individual tests can override as needed
};

/**
 * Mock viewing recovery codes initiation
 * Returns mfaToken for verification step
 */
export const mockMFAViewCodesInitiate = (mfaToken: string) => {
  vi.mocked(axios.post).mockResolvedValueOnce({
    data: {
      result: {
        mfaRequired: true,
        mfaToken,
        message: 'Please verify your identity',
      },
    },
  });
};

/**
 * Mock viewing recovery codes verification with custom recovery codes
 * Returns the list of recovery codes with status
 */
export const mockMFAViewCodesVerify = (codes: unknown[], downloadToken?: string) => {
  vi.mocked(axios.post).mockResolvedValueOnce({
    data: {
      result: {
        codes,
        downloadToken,
      },
    },
  });
};

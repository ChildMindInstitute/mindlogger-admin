import { useState } from 'react';
import { AxiosError } from 'axios';

import { mfaApi } from 'shared/api';
import { RecoveryCodeItem } from 'shared/api/api.mfa.types';

/**
 * Hook for viewing MFA recovery codes with TOTP or recovery code verification.
 *
 * SECURITY FLOW:
 * 1. User clicks "View" recovery codes in Account Settings
 * 2. Frontend calls initiate endpoint (validates MFA enabled & codes exist)
 * 3. User enters TOTP code OR recovery code
 * 4. Frontend calls verify endpoint with mfaToken + code
 * 5. Backend tries TOTP verification first, then recovery code if TOTP fails
 * 6. Backend returns recovery codes + download token (5-minute expiry)
 * 7. Display codes only after successful verification
 *
 * IMPORTANT:
 * - Recovery codes are stored encrypted in the database
 * - Backend requires either TOTP or a valid recovery code before showing all codes
 * - If recovery code is used, it will be marked as "used" and cannot be reused
 */

interface ErrorResponse {
  result?: Array<{
    message?: string;
  }>;
}

const getErrorMessage = (error: AxiosError, isRecoveryCode: boolean = false): string => {
  const responseData = error.response?.data as ErrorResponse | undefined;
  const backendMessage = responseData?.result?.[0]?.message || '';

  // Handle specific error cases
  if (error.response?.status === 400 || backendMessage.toLowerCase().includes('invalid')) {
    return isRecoveryCode
      ? 'Invalid recovery code. Please try again.'
      : 'Invalid verification code. Please try again.';
  }
  if (error.response?.status === 403 || backendMessage.toLowerCase().includes('not enabled')) {
    return 'MFA is not enabled for your account.';
  }
  if (
    error.response?.status === 404 ||
    backendMessage.toLowerCase().includes('no recovery codes')
  ) {
    return 'No recovery codes found. Please set up MFA first.';
  }
  if (error.response?.status === 429 || backendMessage.toLowerCase().includes('too many')) {
    return 'Too many attempts. Please try again later.';
  }
  if (error.code === 'ERR_NETWORK') {
    return 'Network error. Please check your connection and try again.';
  }

  return 'An error occurred. Please try again.';
};

interface VerificationResult {
  success: boolean;
  recoveryCodes?: string[];
}

export const useViewRecoveryCodes = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const handleVerifyCode = async (_code: string): Promise<VerificationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Initiate recovery codes viewing (validates MFA enabled & codes exist)
      const initiateResponse = await mfaApi.initiateViewRecoveryCodes();
      const mfaToken = initiateResponse.data?.result?.mfaToken;

      if (!mfaToken) {
        throw new Error('Failed to initiate recovery codes viewing');
      }

      // Step 2: Verify TOTP code and get recovery codes
      const verifyResponse = await mfaApi.verifyAndViewRecoveryCodes({
        mfaToken,
        code: _code,
      });

      const recoveryCodesData = verifyResponse.data?.result;

      if (!recoveryCodesData?.codes) {
        throw new Error('No recovery codes found');
      }

      // Extract just the code strings from the response
      const codes = recoveryCodesData.codes.map((item: RecoveryCodeItem) => item.code);
      setRecoveryCodes(codes);
      
      // Store download token for backend download (5-minute expiry)
      if (recoveryCodesData.downloadToken) {
        setDownloadToken(recoveryCodesData.downloadToken);
      }

      return {
        success: true,
        recoveryCodes: codes,
      };
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage = getErrorMessage(axiosError, false);
      setError(errorMessage);

      return {
        success: false,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyRecoveryCode = async (_code: string): Promise<VerificationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Initiate recovery codes viewing (validates MFA enabled & codes exist)
      const initiateResponse = await mfaApi.initiateViewRecoveryCodes();
      const mfaToken = initiateResponse.data?.result?.mfaToken;

      if (!mfaToken) {
        throw new Error('Failed to initiate recovery codes viewing');
      }

      // Step 2: Verify recovery code and get all recovery codes
      // Note: The recovery code used for verification will be marked as "used"
      const verifyResponse = await mfaApi.verifyAndViewRecoveryCodes({
        mfaToken,
        code: _code,
      });

      const recoveryCodesData = verifyResponse.data?.result;

      if (!recoveryCodesData?.codes) {
        throw new Error('No recovery codes found');
      }

      // Extract just the code strings from the response
      const codes = recoveryCodesData.codes.map((item: RecoveryCodeItem) => item.code);
      setRecoveryCodes(codes);
      
      // Store download token for backend download (5-minute expiry)
      if (recoveryCodesData.downloadToken) {
        setDownloadToken(recoveryCodesData.downloadToken);
      }

      return {
        success: true,
        recoveryCodes: codes,
      };
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage = getErrorMessage(axiosError, true);
      setError(errorMessage);

      return {
        success: false,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verificationCode,
    setVerificationCode,
    recoveryCode,
    setRecoveryCode,
    recoveryCodes,
    downloadToken,
    isLoading,
    error,
    clearError,
    handleVerifyCode,
    handleVerifyRecoveryCode,
  };
};

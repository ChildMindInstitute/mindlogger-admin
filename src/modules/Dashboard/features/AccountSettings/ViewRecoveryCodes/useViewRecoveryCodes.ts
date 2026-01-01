import { useState, useCallback, useRef } from 'react';
import { AxiosError } from 'axios';

import { mfaApi } from 'shared/api';
import { RecoveryCodeItem } from 'shared/api/api.mfa.types';

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
  recoveryCodes?: RecoveryCodeItem[];
}

export const useViewRecoveryCodes = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<RecoveryCodeItem[] | null>(null);
  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Session management state
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const hasInitiatedSession = useRef(false);

  const clearError = () => {
    setError(null);
  };

  // Initiate MFA session once when modal opens
  const initiateSession = useCallback(async () => {
    // Check only state, not ref (allows StrictMode double call)
    if (sessionInitialized || mfaToken) {
      return { success: true, mfaToken };
    }

    setIsLoading(true);

    try {
      const initiateResponse = await mfaApi.initiateViewRecoveryCodes();
      const token = initiateResponse.data?.result?.mfaToken;

      if (!token) {
        throw new Error('Failed to initiate recovery codes viewing');
      }

      // Set ref AFTER API call succeeds to prevent subsequent calls
      hasInitiatedSession.current = true;
      setMfaToken(token);
      setSessionInitialized(true);
      setIsLoading(false);

      return { success: true, mfaToken: token };
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage = getErrorMessage(axiosError, false);
      setError(errorMessage);
      setIsLoading(false);

      return { success: false };
    }
  }, [sessionInitialized, mfaToken]);

  const handleVerifyCode = async (_code: string): Promise<VerificationResult> => {
    if (!mfaToken) {
      setError('Session expired. Please try again.');

      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use existing session to verify TOTP code
      const verifyResponse = await mfaApi.verifyAndViewRecoveryCodes({
        mfaToken,
        code: _code,
      });

      const recoveryCodesData = verifyResponse.data?.result;

      if (!recoveryCodesData?.codes) {
        throw new Error('No recovery codes found');
      }

      // Store the full recovery code items (with used status)
      setRecoveryCodes(recoveryCodesData.codes);

      // Store download token for backend download (5-minute expiry)
      if (recoveryCodesData.downloadToken) {
        setDownloadToken(recoveryCodesData.downloadToken);
      }

      return {
        success: true,
        recoveryCodes: recoveryCodesData.codes,
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
    if (!mfaToken) {
      setError('Session expired. Please try again.');

      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use existing session to verify recovery code
      const verifyResponse = await mfaApi.verifyAndViewRecoveryCodes({
        mfaToken,
        code: _code,
      });

      const recoveryCodesData = verifyResponse.data?.result;

      if (!recoveryCodesData?.codes) {
        throw new Error('No recovery codes found');
      }

      // Store the full recovery code items (with used status)
      setRecoveryCodes(recoveryCodesData.codes);

      // Store download token for backend download (5-minute expiry)
      if (recoveryCodesData.downloadToken) {
        setDownloadToken(recoveryCodesData.downloadToken);
      }

      return {
        success: true,
        recoveryCodes: recoveryCodesData.codes,
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

  // Reset session and clear all state
  const resetSession = useCallback(() => {
    hasInitiatedSession.current = false;
    setMfaToken(null);
    setSessionInitialized(false);
    setError(null);
    setVerificationCode('');
    setRecoveryCode('');
    setRecoveryCodes(null);
    setDownloadToken(null);
  }, []);

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
    initiateSession,
    sessionInitialized,
    resetSession,
  };
};

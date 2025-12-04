import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';

import { mfaApi } from 'shared/api';
import { MFAInitiateResponse, MFAVerifyResponse } from 'shared/api/api.mfa.types';

import { MFA_ERROR_MESSAGES, BACKEND_ERROR_PATTERNS } from './MFASetup.const';

interface ErrorResponse {
  result?: Array<{
    message?: string;
  }>;
}

const getErrorMessage = (error: AxiosError): string => {
  const responseData = error.response?.data as ErrorResponse | undefined;
  const backendMessage = responseData?.result?.[0]?.message || '';

  // Match backend error patterns
  if (BACKEND_ERROR_PATTERNS.EXPIRED.test(backendMessage)) {
    return MFA_ERROR_MESSAGES.EXPIRED_SETUP;
  }
  if (BACKEND_ERROR_PATTERNS.INVALID_CODE.test(backendMessage)) {
    return MFA_ERROR_MESSAGES.INVALID_CODE;
  }
  if (BACKEND_ERROR_PATTERNS.NO_PENDING.test(backendMessage)) {
    return MFA_ERROR_MESSAGES.SETUP_NOT_FOUND;
  }

  // Fallback based on status code
  if (error.response?.status === 400) {
    return MFA_ERROR_MESSAGES.INVALID_CODE;
  }
  if (error.response?.status === 404) {
    return MFA_ERROR_MESSAGES.SETUP_NOT_FOUND;
  }
  if (error.code === 'ERR_NETWORK') {
    return MFA_ERROR_MESSAGES.NETWORK_ERROR;
  }

  return MFA_ERROR_MESSAGES.UNKNOWN_ERROR;
};

interface UseMFASetupResult {
  provisioningUri: string | null;
  verificationCode: string;
  isLoading: boolean;
  error: string | null;
  setVerificationCode: (code: string) => void;
  handleVerify: () => Promise<boolean>;
  clearError: () => void;
}

export const useMFASetup = (isOpen: boolean): UseMFASetupResult => {
  const [provisioningUri, setProvisioningUri] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initiate MFA setup when modal opens
  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setProvisioningUri(null);
      setVerificationCode('');
      setError(null);

      return;
    }

    const initiateSetup = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await mfaApi.initiateSetup();
        const data = response.data.result as MFAInitiateResponse;
        setProvisioningUri(data.provisioningUri);
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(getErrorMessage(axiosError));
      } finally {
        setIsLoading(false);
      }
    };

    initiateSetup();
  }, [isOpen]);

  const handleVerify = async (): Promise<boolean> => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError(MFA_ERROR_MESSAGES.INVALID_CODE);

      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await mfaApi.verifyCode({ code: verificationCode });
      const data = response.data.result as MFAVerifyResponse;

      if (data.mfaEnabled) {
        return true;
      } else {
        setError(MFA_ERROR_MESSAGES.INVALID_CODE);

        return false;
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(getErrorMessage(axiosError));

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    provisioningUri,
    verificationCode,
    isLoading,
    error,
    setVerificationCode,
    handleVerify,
    clearError,
  };
};

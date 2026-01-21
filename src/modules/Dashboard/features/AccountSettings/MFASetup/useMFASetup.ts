import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';

import { mfaApi } from 'shared/api';
import { MFAInitiateResponse, MFAVerifyResponse } from 'shared/api/api.mfa.types';
import { Mixpanel, MixpanelEventType } from 'shared/utils';

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
  if (BACKEND_ERROR_PATTERNS.ALREADY_ENABLED.test(backendMessage)) {
    return MFA_ERROR_MESSAGES.ALREADY_ENABLED;
  }
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
  if (error.response?.status === 409) {
    return MFA_ERROR_MESSAGES.ALREADY_ENABLED;
  }
  if (error.code === 'ERR_NETWORK') {
    return MFA_ERROR_MESSAGES.NETWORK_ERROR;
  }

  return MFA_ERROR_MESSAGES.UNKNOWN_ERROR;
};

interface VerifyResult {
  success: boolean;
  recoveryCodes?: string[];
  downloadToken?: string | null;
}

export interface UseMFASetupResult {
  provisioningUri: string | null;
  verificationCode: string;
  isLoading: boolean;
  error: string | null;
  secretKey: string;
  downloadToken: string | null;
  setVerificationCode: (code: string) => void;
  handleVerify: () => Promise<VerifyResult>;
  clearError: () => void;
}

export type { VerifyResult };

export const useMFASetup = (isOpen: boolean): UseMFASetupResult => {
  const [provisioningUri, setProvisioningUri] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initiate MFA setup when modal opens
  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setProvisioningUri(null);
      setSecretKey('');
      setVerificationCode('');
      setError(null);

      return;
    }

    const initiateSetup = async () => {
      setIsLoading(true);
      setError(null);

      // Track MFA setup started
      Mixpanel.track({ action: MixpanelEventType.MFASetupStarted });

      try {
        const response = await mfaApi.initiateSetup();
        const data = response.data.result as MFAInitiateResponse;
        setProvisioningUri(data.provisioningUri);

        // Extract secret key from provisioning URI
        // URI format: otpauth://totp/...?secret=SECRETKEY&...
        const match = data.provisioningUri.match(/secret=([A-Z0-9]+)/i);
        if (match && match[1]) {
          setSecretKey(match[1]);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(getErrorMessage(axiosError));
      } finally {
        setIsLoading(false);
      }
    };

    initiateSetup();
  }, [isOpen]);

  const handleVerify = async (): Promise<VerifyResult> => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError(MFA_ERROR_MESSAGES.INVALID_CODE);

      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await mfaApi.verifyCode({ code: verificationCode });
      const data = response.data.result as MFAVerifyResponse;

      if (data.mfaEnabled) {
        const result = {
          success: true,
          recoveryCodes: data.recoveryCodes,
          downloadToken: data.downloadToken ?? null,
        };
        setDownloadToken(data.downloadToken ?? null);

        // Track MFA enabled successfully and update profile
        Mixpanel.track({ action: MixpanelEventType.MFAEnabledSuccessfully });
        Mixpanel.updateProfile({
          'MFA Enabled': true,
          'MFA Enrolled At': new Date().toISOString(),
          'MFA Last Updated At': new Date().toISOString(),
        });

        return result;
      } else {
        setError(MFA_ERROR_MESSAGES.INVALID_CODE);

        return { success: false };
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(getErrorMessage(axiosError));

      return { success: false };
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
    secretKey,
    downloadToken,
    setVerificationCode,
    handleVerify,
    clearError,
  };
};

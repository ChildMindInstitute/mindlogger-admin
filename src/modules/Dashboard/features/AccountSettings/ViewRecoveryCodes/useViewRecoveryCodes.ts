import { useState, useCallback, useRef } from 'react';
import { AxiosError } from 'axios';

import { mfaApi } from 'shared/api';
import { RecoveryCodeItem } from 'shared/api/api.mfa.types';
import { Mixpanel, MixpanelEventType } from 'shared/utils';

import { parseError } from './ViewRecoveryCodes.utils';
import { ErrorScenario, ErrorMetadata } from './ViewRecoveryCodes.types';

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
  const [errorScenario, setErrorScenario] = useState<ErrorScenario>(ErrorScenario.GENERIC);
  const [errorMetadata, setErrorMetadata] = useState<ErrorMetadata | undefined>(undefined);

  // Session management state
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const hasInitiatedSession = useRef(false);

  const clearError = () => {
    setError(null);
    setErrorScenario(ErrorScenario.GENERIC);
    setErrorMetadata(undefined);
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
      const parsedError = parseError(axiosError);

      setError(parsedError.message);
      setErrorScenario(parsedError.scenario);
      setErrorMetadata(parsedError.metadata);
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

      // Track recovery codes viewed
      Mixpanel.track({ action: MixpanelEventType.RecoveryCodesViewed });

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
      const parsedError = parseError(axiosError, 'totp');

      setError(parsedError.message);
      setErrorScenario(parsedError.scenario);
      setErrorMetadata(parsedError.metadata);

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

      // Track recovery codes viewed
      Mixpanel.track({ action: MixpanelEventType.RecoveryCodesViewed });

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
      const parsedError = parseError(axiosError, 'recovery');

      setError(parsedError.message);
      setErrorScenario(parsedError.scenario);
      setErrorMetadata(parsedError.metadata);

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
    setErrorScenario(ErrorScenario.GENERIC);
    setErrorMetadata(undefined);
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
    errorScenario,
    errorMetadata,
    clearError,
    handleVerifyCode,
    handleVerifyRecoveryCode,
    initiateSession,
    sessionInitialized,
    resetSession,
  };
};

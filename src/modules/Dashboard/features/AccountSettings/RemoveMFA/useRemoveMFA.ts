import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

import { mfaApi } from 'shared/api';

import { MFA_DISABLE_ERROR_MESSAGES } from './RemoveMFA.constants';
import { getErrorMessage } from './RemoveMFA.utils';

interface VerifyResult {
  success: boolean;
}

/**
 * Custom hook for managing MFA disable operations
 * Handles API calls, loading states, and error handling
 */
export const useRemoveMFA = () => {
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  /**
   * Initiates MFA disable by creating a verification session
   * @returns Object with success flag and optional mfaToken
   */
  const initiateDisable = useCallback(async (): Promise<{
    success: boolean;
    mfaToken?: string;
  }> => {
    setIsLoading(true);
    clearError();

    try {
      const response = await mfaApi.initiateDisable();
      const token = response.data.result.mfaToken;
      setMfaToken(token);
      setIsLoading(false);

      return { success: true, mfaToken: token };
    } catch (err) {
      const errorMessage = getErrorMessage(err as AxiosError);
      setError(errorMessage);
      setIsLoading(false);

      return { success: false };
    }
  }, []);

  /**
   * Verifies TOTP or recovery code and disables MFA
   * @param code - TOTP code from authenticator app or recovery code
   * @returns Object with success flag
   */
  const verifyAndDisable = useCallback(
    async (code: string): Promise<VerifyResult> => {
      if (!mfaToken) {
        setError(MFA_DISABLE_ERROR_MESSAGES.EXPIRED_SESSION);

        return { success: false };
      }

      setIsLoading(true);
      clearError();

      try {
        await mfaApi.verifyAndDisable({
          mfaToken,
          code,
        });

        setIsLoading(false);

        return { success: true };
      } catch (err) {
        const errorMessage = getErrorMessage(err as AxiosError);
        setError(errorMessage);
        setIsLoading(false);

        return { success: false };
      }
    },
    [mfaToken],
  );

  return {
    mfaToken,
    isLoading,
    error,
    clearError,
    initiateDisable,
    verifyAndDisable,
  };
};

import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { auth } from 'modules/Auth/state';
import { navigateToLibrary } from 'modules/Auth/utils';
import { useAppDispatch, useAppSelector } from 'redux/store';

import { useMFASessionExpiry } from './useMFASessionExpiry';

export type MFAVerificationType = 'totp' | 'recovery';

/**
 * Custom hook for MFA verification logic
 *
 * This hook follows the hybrid state management pattern:
 * - Local state (isSubmitting) for synchronous UI control
 * - Redux state (mfaVerification) for application-wide error display
 *
 * @param type - The type of MFA verification ('totp' or 'recovery')
 * @returns {Object} MFA verification state and actions
 * @returns {string | undefined} returns.error - Current error message from Redux state
 * @returns {boolean} returns.isSubmitting - Whether a verification is in progress
 * @returns {number} returns.attempts - Number of failed attempts
 * @returns {number} returns.maxAttempts - Maximum allowed attempts (5)
 * @returns {Function} returns.verifyCode - Async function to verify the code
 * @returns {Function} returns.clearError - Function to clear the error state
 * @returns {Function} returns.cleanup - Cleanup function to call on unmount
 *
 * @example
 * const { error, isSubmitting, verifyCode, clearError } = useMFAVerification('totp');
 *
 * // In form submission
 * const success = await verifyCode(code);
 * if (!success) {
 *   // Handle error - error message is available in 'error' state
 * }
 */
export const useMFAVerification = (type: MFAVerificationType) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('app');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSessionExpiredRef = useRef(false);

  const { mfaSession, mfaVerification } = useAppSelector((state) => state.auth);
  const attempts = mfaSession?.attempts || 0;
  const maxAttempts = 5;

  // Handle session expiry
  const handleSessionExpired = useCallback(() => {
    if (hasSessionExpiredRef.current) return;
    hasSessionExpiredRef.current = true;

    dispatch(auth.actions.setMFAError(t('mfaSessionExpired')));
    // Don't clear the session or navigate - just show the error
  }, [dispatch, t]);

  // Use session expiry hook
  useMFASessionExpiry({ mfaSession, onExpire: handleSessionExpired });

  // Verify code
  const verifyCode = useCallback(
    async (code: string) => {
      if (isSubmitting) return;

      setIsSubmitting(true);

      let result;
      if (type === 'totp') {
        const { verifyMFATOTP } = auth.thunk;
        result = await dispatch(verifyMFATOTP({ totpCode: code }));

        if (verifyMFATOTP.fulfilled.match(result)) {
          navigateToLibrary(navigate);

          return true;
        }
      } else {
        const { verifyMFARecoveryCode } = auth.thunk;
        result = await dispatch(verifyMFARecoveryCode({ code }));

        if (verifyMFARecoveryCode.fulfilled.match(result)) {
          navigateToLibrary(navigate);

          return true;
        }
      }

      setIsSubmitting(false);

      return false;
    },
    [dispatch, navigate, type, isSubmitting],
  );

  // Clear error when user types
  const clearError = useCallback(() => {
    if (mfaVerification.error) {
      dispatch(auth.actions.clearMFAError());
    }
  }, [dispatch, mfaVerification.error]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    hasSessionExpiredRef.current = false;
  }, []);

  return {
    // State
    error: mfaVerification.error,
    displayError: mfaVerification.displayError, // Direct from Redux, no transformation
    isSubmitting,
    attempts,
    maxAttempts,

    // Actions
    verifyCode,
    clearError,
    cleanup,
  };
};

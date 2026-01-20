import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from 'modules/Auth/state';
import { navigateToLibrary } from 'modules/Auth/utils';
import { useAppDispatch, useAppSelector } from 'redux/store';

export type MFAVerificationType = 'totp' | 'recovery';

/**
 * Custom hook for MFA verification logic
 *
 * This hook follows the hybrid state management pattern:
 * - Local state (isSubmitting) for synchronous UI control
 * - Redux state (totpVerification/recoveryVerification) for error display
 * - Separate states for TOTP and Recovery to prevent error bleeding between forms
 * - All session/attempt tracking is handled by the backend
 *
 * @param type - The type of MFA verification ('totp' or 'recovery')
 * @returns {Object} MFA verification state and actions
 * @returns {string | undefined} returns.error - Current error message from Redux state
 * @returns {boolean} returns.isSubmitting - Whether a verification is in progress
 * @returns {boolean} returns.isSessionExpired - Whether the MFA session has expired
 * @returns {Function} returns.verifyCode - Async function to verify the code
 * @returns {Function} returns.clearError - Function to clear the error state
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Select verification state based on type - separate states for TOTP and Recovery
  const { totpVerification, recoveryVerification, isSessionExpired } = useAppSelector(
    (state) => state.auth,
  );

  const verification = type === 'totp' ? totpVerification : recoveryVerification;

  // Verify code - session expiry and attempts are validated by the backend
  const verifyCode = useCallback(
    async (code: string) => {
      // Don't call API if session already expired (from previous API response)
      if (isSessionExpired) return false;

      if (isSubmitting) return false;

      setIsSubmitting(true);

      let result;
      if (type === 'totp') {
        const { verifyMFATOTP } = auth.thunk;
        result = await dispatch(verifyMFATOTP({ totpCode: code }));

        if (verifyMFATOTP.fulfilled.match(result)) {
          // Navigate first, then clear session to prevent guard redirect race condition
          navigateToLibrary(navigate);
          dispatch(auth.actions.clearMFASession());

          return true;
        }
      } else {
        const { verifyMFARecoveryCode } = auth.thunk;
        result = await dispatch(verifyMFARecoveryCode({ code }));

        if (verifyMFARecoveryCode.fulfilled.match(result)) {
          // Navigate first, then clear session to prevent guard redirect race condition
          navigateToLibrary(navigate);
          dispatch(auth.actions.clearMFASession());

          return true;
        }
      }

      setIsSubmitting(false);

      return false;
    },
    [dispatch, navigate, type, isSubmitting, isSessionExpired],
  );

  // Clear error when user types - dispatches correct action based on type
  const clearError = useCallback(() => {
    // Don't clear session-expired errors
    if (isSessionExpired || verification.displayError === 'mfaSessionExpired') {
      return;
    }

    if (type === 'totp') {
      dispatch(auth.actions.clearTOTPError());
    } else {
      dispatch(auth.actions.clearRecoveryError());
    }
  }, [dispatch, type, isSessionExpired, verification.displayError]);

  return {
    // State
    error: verification.displayError,
    displayError: verification.displayError, // Direct from Redux, no transformation
    isSessionExpired,
    isSubmitting,

    // Actions
    verifyCode,
    clearError,
  };
};

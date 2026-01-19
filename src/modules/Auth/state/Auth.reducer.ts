import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { ApiErrorReturn } from 'shared/state/Base';

import { AuthSchema, SoftLockData, MFASession } from './Auth.schema';
import { signIn, getUserDetails, verifyMFATOTP, verifyMFARecoveryCode } from './Auth.thunk';
import {
  createAuthFulfilledData,
  createAuthPendingData,
  createAuthRejectedData,
} from './Auth.utils';
import { state as initialState } from './Auth.state';
import { MfaErrorResult } from '../utils/mfa.utils';

export const reducers = {
  startLogout: (state: AuthSchema): void => {
    state.isLogoutInProgress = true;
  },
  endLogout: (state: AuthSchema): void => {
    state.isLogoutInProgress = false;
  },
  resetAuthorization: (state: AuthSchema): void => {
    sessionStorage.clear();
    state.authentication = initialState.authentication;
    state.isAuthorized = false;
    state.mfaSession = undefined;
    state.totpVerification = { status: 'idle' };
    state.recoveryVerification = { status: 'idle' };
    state.isSessionExpired = false;
  },
  startSoftLock: (state: AuthSchema, { payload }: PayloadAction<SoftLockData>): void => {
    state.softLockData = payload;
  },
  endSoftLock: (state: AuthSchema): void => {
    delete state.softLockData;
  },
  // MFA actions
  setMFASession: (state: AuthSchema, { payload }: PayloadAction<MFASession>): void => {
    state.mfaSession = payload;
  },
  clearMFASession: (state: AuthSchema): void => {
    state.mfaSession = undefined;
    state.totpVerification = { status: 'idle' };
    state.recoveryVerification = { status: 'idle' };
    state.isSessionExpired = false;
  },
  // Clear TOTP error (when user types in TOTP form)
  clearTOTPError: (state: AuthSchema): void => {
    if (state.isSessionExpired) return;
    state.totpVerification.displayError = undefined;
    state.totpVerification.status = 'idle';
  },
  // Clear Recovery error (when user types in Recovery form)
  clearRecoveryError: (state: AuthSchema): void => {
    if (state.isSessionExpired) return;
    state.recoveryVerification.displayError = undefined;
    state.recoveryVerification.status = 'idle';
  },
  setMFASessionExpired: (state: AuthSchema): void => {
    state.isSessionExpired = true;
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<AuthSchema>): void => {
  builder.addCase(signIn.pending, ({ authentication }, action) => {
    createAuthPendingData(authentication, action.meta.requestId);
  });

  builder.addCase(signIn.fulfilled, (state, action) => {
    const result = action.payload?.result;

    // Check if MFA is required
    if (result && 'mfaRequired' in result && result.mfaRequired) {
      // Set MFA session data - only store backend-provided tokens
      // Session expiry and attempts are tracked by the backend
      state.mfaSession = {
        token: result.mfaToken,
        sessionId: result.mfaSessionId,
      };
      // Don't set authentication data yet
      state.authentication.status = 'idle';
      state.authentication.requestId = action.meta.requestId;
    } else {
      // Normal login flow - set user data
      createAuthFulfilledData(state, action.meta.requestId, { user: result?.user });
    }
  });

  builder.addCase(signIn.rejected, (state, action) => {
    createAuthRejectedData(state, action.meta.requestId, action.payload as ApiErrorReturn);
  });

  builder.addCase(getUserDetails.pending, ({ authentication }, action) => {
    createAuthPendingData(authentication, action.meta.requestId);
  });

  builder.addCase(getUserDetails.fulfilled, (state, action) => {
    createAuthFulfilledData(state, action.meta.requestId, { user: action.payload.data.result });
  });

  builder.addCase(getUserDetails.rejected, (state, action) => {
    createAuthRejectedData(state, action.meta.requestId, action.payload as ApiErrorReturn);
  });

  // MFA TOTP verification reducers
  builder.addCase(verifyMFATOTP.pending, (state) => {
    state.totpVerification.status = 'loading';
    state.totpVerification.displayError = undefined;
  });

  builder.addCase(verifyMFATOTP.fulfilled, (state, action) => {
    // Set user data - mfaSession is cleared by useMFAVerification after navigation
    createAuthFulfilledData(state, action.meta.requestId, { user: action.payload?.result.user });
    state.totpVerification = { status: 'idle' };
    state.recoveryVerification = { status: 'idle' };
    state.isSessionExpired = false;
  });

  builder.addCase(verifyMFATOTP.rejected, (state, action) => {
    // Skip if already expired
    if (state.isSessionExpired) return;

    state.totpVerification.status = 'error';

    // Handle both string and MfaErrorResult payloads
    // String: from API returning invalid response (e.g., wrong code)
    // MfaErrorResult: from exception handling (e.g., session expired, network error)
    if (typeof action.payload === 'string') {
      state.totpVerification.displayError = 'invalidCode';

      return;
    }

    const { translationKey, isSessionExpired, attemptsRemaining } =
      action.payload as MfaErrorResult;

    state.totpVerification.attemptsRemaining = attemptsRemaining;

    if (isSessionExpired) {
      state.totpVerification.displayError = translationKey;
      state.isSessionExpired = true;

      return;
    }

    // Format with attempts warning (threshold: 3)
    if (attemptsRemaining !== null && attemptsRemaining <= 3) {
      state.totpVerification.displayError = `${translationKey}|${attemptsRemaining}`;
    } else {
      state.totpVerification.displayError = translationKey;
    }
  });

  // Recovery code verification reducers
  builder.addCase(verifyMFARecoveryCode.pending, (state) => {
    state.recoveryVerification.status = 'loading';
    state.recoveryVerification.displayError = undefined;
  });

  builder.addCase(verifyMFARecoveryCode.fulfilled, (state, action) => {
    // Set user data - mfaSession is cleared by useMFAVerification after navigation
    createAuthFulfilledData(state, action.meta.requestId, { user: action.payload?.result.user });
    state.totpVerification = { status: 'idle' };
    state.recoveryVerification = { status: 'idle' };
    state.isSessionExpired = false;
  });

  builder.addCase(verifyMFARecoveryCode.rejected, (state, action) => {
    // Skip if already expired
    if (state.isSessionExpired) return;

    state.recoveryVerification.status = 'error';

    // Handle both string and MfaErrorResult payloads
    // String: from API returning invalid response (e.g., wrong code)
    // MfaErrorResult: from exception handling (e.g., session expired, network error)
    if (typeof action.payload === 'string') {
      state.recoveryVerification.displayError = 'invalidRecoveryCode';

      return;
    }

    const { translationKey, isSessionExpired, attemptsRemaining } =
      action.payload as MfaErrorResult;

    state.recoveryVerification.attemptsRemaining = attemptsRemaining;

    if (isSessionExpired) {
      state.recoveryVerification.displayError = translationKey;
      state.isSessionExpired = true;

      return;
    }

    // Format with attempts warning (threshold: 3) - same as TOTP
    if (attemptsRemaining !== null && attemptsRemaining <= 3) {
      state.recoveryVerification.displayError = `${translationKey}|${attemptsRemaining}`;
    } else {
      state.recoveryVerification.displayError = translationKey;
    }
  });
};

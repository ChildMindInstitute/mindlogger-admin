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

// Helper to detect expiry messages from backend
const isSessionExpiredError = (message: string): boolean => {
  const lower = message.toLowerCase();

  return (
    lower.includes('session not found') ||
    lower.includes('expired') ||
    lower.includes('session expired')
  );
};

// Helper to apply session expired state (can't call reducers directly in extraReducers)
const applySessionExpired = (state: AuthSchema, errorMessage?: string): void => {
  state.mfaVerification.status = 'error';
  state.mfaVerification.displayError = 'mfaSessionExpired';
  state.mfaVerification.isSessionExpired = true;
  if (errorMessage) {
    state.mfaVerification.error = errorMessage;
  }
};

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
    state.mfaVerification = { status: 'idle', isSessionExpired: false };
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
    state.mfaVerification = { status: 'idle', isSessionExpired: false };
  },
  incrementMFAAttempts: (state: AuthSchema): void => {
    if (state.mfaSession) {
      state.mfaSession.attempts += 1;
    }
  },
  clearMFAError: (state: AuthSchema): void => {
    // Don't clear if session expired - it's terminal
    if (
      state.mfaVerification.isSessionExpired ||
      state.mfaVerification.displayError === 'mfaSessionExpired'
    ) {
      return;
    }

    state.mfaVerification.error = undefined;
    state.mfaVerification.displayError = undefined;
    state.mfaVerification.status = 'idle';
  },
  setMFAError: (state: AuthSchema, action: PayloadAction<string>): void => {
    state.mfaVerification.error = action.payload;
    state.mfaVerification.status = 'error';
    // Don't set displayError here - let rejected handlers or specific actions do it
  },
  setMFASessionExpired: (state: AuthSchema): void => {
    state.mfaVerification.status = 'error';
    state.mfaVerification.displayError = 'mfaSessionExpired';
    state.mfaVerification.isSessionExpired = true;
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
      // Set MFA session data
      state.mfaSession = {
        token: result.mfaToken,
        sessionId: result.mfaSessionId,
        attempts: 0,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
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
    state.mfaVerification.status = 'loading';
    state.mfaVerification.error = undefined;
  });

  builder.addCase(verifyMFATOTP.fulfilled, (state, action) => {
    // Set user data and clear MFA session
    createAuthFulfilledData(state, action.meta.requestId, { user: action.payload?.result.user });
    state.mfaSession = undefined;
    state.mfaVerification = { status: 'idle' };
  });

  builder.addCase(verifyMFATOTP.rejected, (state, action) => {
    // Skip if already expired
    if (state.mfaVerification.isSessionExpired) return;

    // Extract error message from the payload
    const errorPayload = action.payload as any;
    let errorMessage = 'Invalid verification code';
    if (typeof errorPayload === 'string') {
      errorMessage = errorPayload;
    } else if (errorPayload?.message) {
      errorMessage = errorPayload.message;
    }

    // CHECK FOR EXPIRY FROM BACKEND FIRST - before anything else
    if (isSessionExpiredError(errorMessage)) {
      applySessionExpired(state, errorMessage);

      return; // Do NOT increment attempts
    }

    // Normal invalid code flow
    state.mfaVerification.status = 'error';
    state.mfaVerification.error = errorMessage;

    // Safe increment - avoid NaN if attempts is undefined
    if (state.mfaSession) {
      state.mfaSession.attempts = (state.mfaSession.attempts ?? 0) + 1;
    }

    // Set displayError - simplified logic for "Invalid code" with attempts
    const attempts = state.mfaSession?.attempts || 0;
    const maxAttempts = 5;

    if (attempts >= 3 && attempts < maxAttempts) {
      const remaining = maxAttempts - attempts;
      state.mfaVerification.displayError = `invalidCode|${remaining}`; // Format: "invalidCode|2"
    } else {
      state.mfaVerification.displayError = 'invalidCode';
    }
  });

  // Recovery code verification reducers
  builder.addCase(verifyMFARecoveryCode.pending, (state) => {
    state.mfaVerification.status = 'loading';
    state.mfaVerification.error = undefined;
  });

  builder.addCase(verifyMFARecoveryCode.fulfilled, (state, action) => {
    // Set user data and clear MFA session
    createAuthFulfilledData(state, action.meta.requestId, { user: action.payload?.result.user });
    state.mfaSession = undefined;
    state.mfaVerification = { status: 'idle' };
  });

  builder.addCase(verifyMFARecoveryCode.rejected, (state, action) => {
    // Skip if already expired
    if (state.mfaVerification.isSessionExpired) return;

    // Extract error message from the payload
    const errorPayload = action.payload as any;
    let errorMessage = 'Invalid recovery code';
    if (typeof errorPayload === 'string') {
      errorMessage = errorPayload;
    } else if (errorPayload?.message) {
      errorMessage = errorPayload.message;
    }

    // CHECK FOR EXPIRY FROM BACKEND FIRST
    if (isSessionExpiredError(errorMessage)) {
      applySessionExpired(state, errorMessage);

      return; // No further processing
    }

    // Normal invalid recovery code flow
    state.mfaVerification.status = 'error';
    state.mfaVerification.error = errorMessage;
    state.mfaVerification.displayError = 'invalidRecoveryCode';
    // Note: Recovery codes don't track attempts (one-time use codes)
  });
};

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
  },
  incrementMFAAttempts: (state: AuthSchema): void => {
    if (state.mfaSession) {
      state.mfaSession.attempts += 1;
    }
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

  // MFA verification reducers
  builder.addCase(verifyMFATOTP.pending, ({ authentication }, action) => {
    createAuthPendingData(authentication, action.meta.requestId);
  });

  builder.addCase(verifyMFATOTP.fulfilled, (state, action) => {
    // Set user data and clear MFA session
    createAuthFulfilledData(state, action.meta.requestId, { user: action.payload?.result.user });
    state.mfaSession = undefined;
  });

  builder.addCase(verifyMFATOTP.rejected, (state, action) => {
    createAuthRejectedData(state, action.meta.requestId, action.payload as ApiErrorReturn);
    // Increment attempts on failure
    if (state.mfaSession) {
      state.mfaSession.attempts += 1;
    }
  });

  // Recovery code verification reducers
  builder.addCase(verifyMFARecoveryCode.pending, ({ authentication }, action) => {
    createAuthPendingData(authentication, action.meta.requestId);
  });

  builder.addCase(verifyMFARecoveryCode.fulfilled, (state, action) => {
    // Set user data and clear MFA session
    createAuthFulfilledData(state, action.meta.requestId, { user: action.payload?.result.user });
    state.mfaSession = undefined;
  });

  builder.addCase(verifyMFARecoveryCode.rejected, (state, action) => {
    createAuthRejectedData(state, action.meta.requestId, action.payload as ApiErrorReturn);
  });
};

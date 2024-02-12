import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { ApiErrorReturn } from 'shared/state/Base';

import { AuthSchema } from './Auth.schema';
import { signIn, getUserDetails } from './Auth.thunk';
import { createAuthFulfilledData, createAuthPendingData, createAuthRejectedData } from './Auth.utils';
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
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<AuthSchema>): void => {
  builder.addCase(signIn.pending, ({ authentication }, action) => {
    createAuthPendingData(authentication, action.meta.requestId);
  });

  builder.addCase(signIn.fulfilled, (state, action) => {
    createAuthFulfilledData(state, action.meta.requestId, { user: action.payload?.result.user });
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
};

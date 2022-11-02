import { AxiosError } from 'axios';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { AuthSchema } from './Auth.schema';
import { login, loginWithToken, signup } from './Auth.thunk';
import {
  createAuthFulfilledData,
  createAuthPendingData,
  createAuthRejectedData,
} from './Auth.utils';
import { state as initialState } from './Auth.state';

export const reducers = {
  resetAuthorization: (state: AuthSchema): void => {
    sessionStorage.removeItem('accessToken');
    state.authentication = initialState.authentication;
    state.isAuthorized = false;
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<AuthSchema>): void => {
  builder.addCase(login.pending, ({ authentication }, action) => {
    createAuthPendingData(authentication, action.meta.requestId);
  });

  builder.addCase(login.fulfilled, (state, action) => {
    createAuthFulfilledData(state, action.meta.requestId, action.payload.data);
  });

  builder.addCase(login.rejected, (state, action) => {
    createAuthRejectedData(state, action.meta.requestId, action.payload as AxiosError);
  });

  builder.addCase(loginWithToken.pending, ({ authentication }, action) => {
    createAuthPendingData(authentication, action.meta.requestId);
  });

  builder.addCase(loginWithToken.fulfilled, (state, action) => {
    createAuthFulfilledData(state, action.meta.requestId, action.payload.data);
  });

  builder.addCase(loginWithToken.rejected, (state, action) => {
    createAuthRejectedData(state, action.meta.requestId, action.payload as AxiosError);
  });

  builder.addCase(signup.pending, ({ authentication }, action) => {
    createAuthPendingData(authentication, action.meta.requestId);
  });

  builder.addCase(signup.fulfilled, (state, action) => {
    const { account, authToken, ...user } = action.payload.data;
    createAuthFulfilledData(state, action.meta.requestId, { account, authToken, user });
  });

  builder.addCase(signup.rejected, (state, action) => {
    createAuthRejectedData(state, action.meta.requestId, action.payload as AxiosError);
  });
};

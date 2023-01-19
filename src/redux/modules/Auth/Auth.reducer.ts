import { AxiosError } from 'axios';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import storage from 'utils/storage';

import { AuthSchema } from './Auth.schema';
import { setAccountName, signIn, getUserDetails } from './Auth.thunk';
import {
  createAuthFulfilledData,
  createAuthPendingData,
  createAuthRejectedData,
  setAccountNameFulfilledData,
} from './Auth.utils';
import { state as initialState } from './Auth.state';

export const reducers = {
  resetAuthorization: (state: AuthSchema): void => {
    storage.removeItem('accessToken');
    storage.removeItem('refreshToken');
    state.authentication = initialState.authentication;
    state.isAuthorized = false;
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<AuthSchema>): void => {
  builder.addCase(signIn.pending, ({ authentication }, action) => {
    createAuthPendingData(authentication, action.meta.requestId);
  });

  builder.addCase(signIn.fulfilled, (state, action) => {
    createAuthFulfilledData(state, action.meta.requestId, action.payload?.data);
  });

  builder.addCase(signIn.rejected, (state, action) => {
    createAuthRejectedData(state, action.meta.requestId, action.payload as AxiosError);
  });

  builder.addCase(getUserDetails.pending, ({ authentication }, action) => {
    createAuthPendingData(authentication, action.meta.requestId);
  });

  builder.addCase(getUserDetails.fulfilled, (state, action) => {
    createAuthFulfilledData(state, action.meta.requestId, action.payload.data);
  });

  builder.addCase(getUserDetails.rejected, (state, action) => {
    createAuthRejectedData(state, action.meta.requestId, action.payload as AxiosError);
  });

  builder.addCase(setAccountName.pending, ({ authentication }, action) => {
    createAuthPendingData(authentication, action.meta.requestId);
  });

  builder.addCase(setAccountName.fulfilled, (state, action) => {
    const { accountName } = action.payload;
    setAccountNameFulfilledData(state, action.meta.requestId, accountName);
  });

  builder.addCase(setAccountName.rejected, (state, action) => {
    createAuthRejectedData(state, action.meta.requestId, action.payload as AxiosError);
  });
};

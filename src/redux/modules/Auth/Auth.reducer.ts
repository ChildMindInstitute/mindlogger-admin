import { AxiosError } from 'axios';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { createPendingData } from 'redux/store/utils';

import { AuthSchema } from './Auth.schema';
import { setAccountName, signIn, signInWithToken, signUp } from './Auth.thunk';
import {
  createAuthFulfilledData,
  createAuthRejectedData,
  setAccountNameFulfilledData,
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
  createPendingData(builder, signIn, 'authentication');

  builder.addCase(signIn.fulfilled, (state, action) => {
    createAuthFulfilledData(state, action.meta.requestId, action.payload?.data);
  });

  builder.addCase(signIn.rejected, (state, action) => {
    createAuthRejectedData(state, action.meta.requestId, action.payload as AxiosError);
  });

  createPendingData(builder, signInWithToken, 'authentication');

  builder.addCase(signInWithToken.fulfilled, (state, action) => {
    createAuthFulfilledData(state, action.meta.requestId, action.payload.data);
  });

  builder.addCase(signInWithToken.rejected, (state, action) => {
    createAuthRejectedData(state, action.meta.requestId, action.payload as AxiosError);
  });

  createPendingData(builder, signUp, 'authentication');

  builder.addCase(signUp.fulfilled, (state, action) => {
    const { account, authToken, ...user } = action.payload.data;
    createAuthFulfilledData(state, action.meta.requestId, { account, authToken, user });
  });

  builder.addCase(signUp.rejected, (state, action) => {
    createAuthRejectedData(state, action.meta.requestId, action.payload as AxiosError);
  });

  createPendingData(builder, setAccountName, 'authentication');

  builder.addCase(setAccountName.fulfilled, (state, action) => {
    const { accountName } = action.payload;
    setAccountNameFulfilledData(state, action.meta.requestId, accountName);
  });

  builder.addCase(setAccountName.rejected, (state, action) => {
    createAuthRejectedData(state, action.meta.requestId, action.payload as AxiosError);
  });
};

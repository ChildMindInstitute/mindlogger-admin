import { Draft } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';

import { BaseSchema } from 'redux/modules';

import { AuthData, AuthSchema } from './Auth.schema';
import { state as initialState } from './Auth.state';

export const createAuthPendingData = (authentication: Draft<BaseSchema>, requestId: string) => {
  if (authentication.status !== 'loading') {
    authentication.requestId = requestId;
    authentication.status = 'loading';
  }
};

export const createAuthFulfilledData = (
  state: Draft<AuthSchema>,
  requestId: string,
  data: AuthData,
) => {
  const { authentication } = state;
  if (authentication.status === 'loading' && authentication.requestId === requestId) {
    authentication.requestId = initialState.authentication.requestId;
    authentication.status = 'success';
    authentication.error ? (authentication.error = undefined) : null;
    authentication.data = data;
    data ? (state.isAuthorized = true) : null;
  }
};

export const createAuthRejectedData = (
  state: Draft<AuthSchema>,
  requestId: string,
  error: AxiosError,
) => {
  const { authentication } = state;
  if (authentication.status === 'loading' && authentication.requestId === requestId) {
    const axiosResponse = error.response as AxiosResponse;
    authentication.requestId = initialState.authentication.requestId;
    authentication.status = 'error';
    authentication.error = axiosResponse?.data?.result;
    authentication.data ? (authentication.data = null) : null;
    state.isAuthorized = false;
  }
};

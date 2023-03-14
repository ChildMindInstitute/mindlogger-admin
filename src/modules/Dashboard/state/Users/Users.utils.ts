import { ActionReducerMapBuilder, AsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse, AxiosError } from 'axios';

import { getApiError } from 'shared/utils/getApiError';

import { UsersSchema, Roles } from './Users.schema';
import { state as initialState } from './Users.state';

export const createUsersPendingData = (
  builder: ActionReducerMapBuilder<UsersSchema>,
  thunk: AsyncThunk<AxiosResponse, void, Record<string, never>>,
  role: Roles,
) =>
  builder.addCase(thunk.pending, (state, action) => {
    if (state[role].status !== 'loading') {
      state[role].requestId = action.meta.requestId;
      state[role].status = 'loading';
    }
  });

export const createUsersFulfilledData = (
  builder: ActionReducerMapBuilder<UsersSchema>,
  thunk: AsyncThunk<AxiosResponse, void, Record<string, never>>,
  role: Roles,
) =>
  builder.addCase(thunk.fulfilled, (state, action) => {
    if (state[role].status === 'loading' && state[role].requestId === action.meta.requestId) {
      state[role].requestId = initialState[role].requestId;
      state[role].status = 'success';
      state[role].data = action.payload.data;
    }
  });

export const createUsersRejectedData = (
  builder: ActionReducerMapBuilder<UsersSchema>,
  thunk: AsyncThunk<AxiosResponse, void, Record<string, never>>,
  role: Roles,
) =>
  builder.addCase(thunk.rejected, (state, action) => {
    if (state[role].status === 'loading' && state[role].requestId === action.meta.requestId) {
      state[role].requestId = initialState[role].requestId;
      state[role].status = 'error';
      state[role].error = getApiError(action as PayloadAction<AxiosError>);
    }
  });

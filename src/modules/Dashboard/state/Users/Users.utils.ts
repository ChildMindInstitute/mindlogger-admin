import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { getApiError } from 'shared/utils';

import { state as initialState } from './Users.state';
import { CreateUsersStateData } from './Users.schema';

export const createUsersPendingData = ({ builder, thunk, key }: CreateUsersStateData) =>
  builder.addCase(thunk.pending, (state, action) => {
    if (state[key].status !== 'loading') {
      state[key].requestId = action.meta.requestId;
      state[key].status = 'loading';
    }
  });

export const createUsersFulfilledData = ({ builder, thunk, key }: CreateUsersStateData) =>
  builder.addCase(thunk.fulfilled, (state, action) => {
    if (state[key].status === 'loading' && state[key].requestId === action.meta.requestId) {
      state[key].requestId = initialState[key].requestId;
      state[key].status = 'success';
      state[key].data = action.payload.data;
    }
  });

export const createUsersRejectedData = ({ builder, thunk, key }: CreateUsersStateData) =>
  builder.addCase(thunk.rejected, (state, action) => {
    if (state[key].status === 'loading' && state[key].requestId === action.meta.requestId) {
      state[key].requestId = initialState[key].requestId;
      state[key].status = 'error';
      state[key].error = getApiError(action as PayloadAction<AxiosError>);
    }
  });

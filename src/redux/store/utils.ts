import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { ErrorResponse } from 'redux/modules';
import { base } from 'redux/modules/Base';

export const createPendingData = (
  builder: ActionReducerMapBuilder<any>,
  thunk: AsyncThunk<any, any, Record<string, never>>,
  key: string,
) =>
  builder.addCase(thunk.pending, (state, action) => {
    if (state[key].status !== 'loading') {
      state[key].requestId = action.meta.requestId;
      state[key].status = 'loading';
    }
  });

export const createRejectedData = (
  builder: ActionReducerMapBuilder<any>,
  thunk: AsyncThunk<any, any, Record<string, never>>,
  key: string,
) =>
  builder.addCase(thunk.rejected, (state, action) => {
    if (state[key].status === 'loading' && state[key].requestId === action.meta.requestId) {
      const error = action.payload as AxiosError;
      state[key].requestId = base.state.requestId;
      state[key].status = 'error';
      state[key].error = error.response?.data as AxiosError<ErrorResponse>;
    }
  });

export const createFulfilledData = (
  builder: ActionReducerMapBuilder<any>,
  thunk: AsyncThunk<any, any, Record<string, never>>,
  key: string,
) =>
  builder.addCase(thunk.fulfilled, (state, action) => {
    if (state[key].status === 'loading' && state[key].requestId === action.meta.requestId) {
      state[key].requestId = base.state.requestId;
      state[key].status = 'success';
      state[key].data = action.payload.data;
    }
  });

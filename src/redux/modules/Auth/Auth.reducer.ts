import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { AuthSchema } from './Auth.schema';
import { state as initialState } from './Auth.state';
import { login } from './Auth.thunk';

export const extraReducers = (builder: ActionReducerMapBuilder<AuthSchema>): void => {
  builder.addCase(login.pending, (state, action) => {
    if (state.authentication.status !== 'loading') {
      state.authentication.requestId = action.meta.requestId;
      state.authentication.status = 'loading';
    }
  });

  builder.addCase(login.fulfilled, (state, action) => {
    if (
      state.authentication.status === 'loading' &&
      state.authentication.requestId === action.meta.requestId
    ) {
      state.authentication.requestId = initialState.authentication.requestId;
      state.authentication.status = 'success';
      state.authentication.data = action.payload.data;
    }
  });

  builder.addCase(login.rejected, (state, action) => {
    if (
      state.authentication.status === 'loading' &&
      state.authentication.requestId === action.meta.requestId
    ) {
      state.authentication.requestId = initialState.authentication.requestId;
      state.authentication.status = 'error';
      state.authentication.error = action.error;
    }
  });
};

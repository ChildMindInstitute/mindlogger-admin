import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { AuthSchema } from './Auth.schema';
import { state as initialState } from './Auth.state';
import { login } from './Auth.thunk';

export const extraReducers = (builder: ActionReducerMapBuilder<AuthSchema>): void => {
  builder.addCase(login.pending, ({ authentication }, action) => {
    if (authentication.status !== 'loading') {
      authentication.requestId = action.meta.requestId;
      authentication.status = 'loading';
    }
  });

  builder.addCase(login.fulfilled, ({ authentication }, action) => {
    if (authentication.status === 'loading' && authentication.requestId === action.meta.requestId) {
      authentication.requestId = initialState.authentication.requestId;
      authentication.status = 'success';
      authentication.error ? (authentication.error = undefined) : null;
      authentication.data = action.payload.data;
    }
  });

  builder.addCase(login.rejected, ({ authentication }, action) => {
    if (authentication.status === 'loading' && authentication.requestId === action.meta.requestId) {
      authentication.requestId = initialState.authentication.requestId;
      authentication.status = 'error';
      authentication.error = action.error;
    }
  });
};

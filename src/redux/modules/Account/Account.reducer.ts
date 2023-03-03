import { AxiosError } from 'axios';
import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { getApiError } from 'utils/getApiError';

import { AccountSchema } from './Account.schema';
import { switchAccount } from './Account.thunk';
import { state as initialState } from './Account.state';

export const extraReducers = (builder: ActionReducerMapBuilder<AccountSchema>): void => {
  builder.addCase(switchAccount.pending, ({ switchAccount }, action) => {
    if (switchAccount.status !== 'loading') {
      switchAccount.requestId = action.meta.requestId;
      switchAccount.status = 'loading';
    }
  });

  builder.addCase(switchAccount.fulfilled, ({ switchAccount }, action) => {
    if (switchAccount.status === 'loading' && switchAccount.requestId === action.meta.requestId) {
      switchAccount.requestId = initialState.switchAccount.requestId;
      switchAccount.status = 'success';
      switchAccount.data = action.payload.data;
    }
  });

  builder.addCase(switchAccount.rejected, ({ switchAccount }, action) => {
    if (switchAccount.status === 'loading' && switchAccount.requestId === action.meta.requestId) {
      switchAccount.requestId = initialState.switchAccount.requestId;
      switchAccount.status = 'error';
      switchAccount.error = getApiError(action as PayloadAction<AxiosError>);
    }
  });
};

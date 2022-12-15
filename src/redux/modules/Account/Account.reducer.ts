import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { createPendingData, createRejectedData } from 'redux/store/utils';

import { AccountSchema } from './Account.schema';
import { switchAccount } from './Account.thunk';
import { state as initialState } from './Account.state';

export const extraReducers = (builder: ActionReducerMapBuilder<AccountSchema>): void => {
  createPendingData(builder, switchAccount, 'switchAccount');

  builder.addCase(switchAccount.fulfilled, ({ switchAccount }, action) => {
    if (switchAccount.status === 'loading' && switchAccount.requestId === action.meta.requestId) {
      switchAccount.requestId = initialState.switchAccount.requestId;
      switchAccount.status = 'success';
      switchAccount.data = action.payload.data;
    }
  });

  createRejectedData(builder, switchAccount, 'switchAccount');
};

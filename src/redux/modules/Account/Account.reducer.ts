import { AxiosError } from 'axios';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { ErrorResponse } from 'redux/modules/Base';

import { AccountSchema } from './Account.schema';
import { getAppletsForFolders, switchAccount } from './Account.thunk';
import { state as initialState } from './Account.state';
import { createAccountPendingData } from './Account.utils';

export const extraReducers = (builder: ActionReducerMapBuilder<AccountSchema>): void => {
  builder.addCase(switchAccount.pending, ({ switchAccount }, action) => {
    createAccountPendingData(switchAccount, action.meta.requestId);
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
      const error = action.payload as AxiosError;
      switchAccount.requestId = initialState.switchAccount.requestId;
      switchAccount.status = 'error';
      switchAccount.error = error.response?.data as AxiosError<ErrorResponse>;
    }
  });

  builder.addCase(getAppletsForFolders.pending, ({ accountFoldersApplets }, action) => {
    createAccountPendingData(accountFoldersApplets, action.meta.requestId);
  });

  builder.addCase(getAppletsForFolders.fulfilled, ({ accountFoldersApplets }, action) => {
    if (
      accountFoldersApplets.status === 'loading' &&
      accountFoldersApplets.requestId === action.meta.requestId
    ) {
      accountFoldersApplets.requestId = initialState.accountFoldersApplets.requestId;
      accountFoldersApplets.status = 'success';
      accountFoldersApplets.data = action.payload;
    }
  });

  builder.addCase(getAppletsForFolders.rejected, ({ accountFoldersApplets }, action) => {
    if (
      accountFoldersApplets.status === 'loading' &&
      accountFoldersApplets.requestId === action.meta.requestId
    ) {
      const error = action.payload as AxiosError;
      accountFoldersApplets.requestId = initialState.accountFoldersApplets.requestId;
      accountFoldersApplets.status = 'error';
      accountFoldersApplets.error = error.response?.data as AxiosError<ErrorResponse>;
    }
  });
};

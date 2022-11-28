import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { Account, ApiError, Folder } from 'redux/modules';

import {
  switchAccountApi,
  SwitchAccount,
  updateAlertStatusApi,
  UpdateAlertStatus,
  getAppletsInFolderApi,
} from 'api';
import { setAppletsInFolder } from 'redux/modules/Account/Account.utils';

export const switchAccount = createAsyncThunk(
  'account/switchAccount',
  async ({ accountId }: SwitchAccount, { rejectWithValue, signal }) => {
    try {
      return await switchAccountApi({ accountId }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const updateAlertStatus = createAsyncThunk(
  'account/updateAlertStatus',
  async ({ alertId }: UpdateAlertStatus, { rejectWithValue, signal }) => {
    try {
      return await updateAlertStatusApi({ alertId }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const getAppletsForFolders = createAsyncThunk(
  'account/getAppletsInFolders',
  async ({ account }: { account: Account }, { dispatch }) => {
    let foldersData = [];

    if (account.folders.length) {
      foldersData = (
        await Promise.allSettled(
          account.folders.map(async (folder) => await dispatch(getAppletsForFolder({ folder }))),
        )
      )
        .filter((folder) => folder.status === 'fulfilled')
        .map((folder) => (folder as PromiseFulfilledResult<any>).value.payload);
    }

    return [...foldersData, ...account.applets];
  },
);

export const getAppletsForFolder = createAsyncThunk(
  'account/getAppletsInFolder',
  async ({ folder }: { folder: Folder }, { rejectWithValue, signal }) => {
    try {
      const folderData = await getAppletsInFolderApi({ folderId: folder.id }, signal);
      return setAppletsInFolder({ folder, appletsInFolder: folderData.data });
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

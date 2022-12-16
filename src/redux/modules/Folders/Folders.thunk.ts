import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { Account, ApiError, Folder, FolderApplet, FoldersSchema } from 'redux/modules';
import {
  getAppletsInFolderApi,
  saveFolderApi,
  deleteFolderApi,
  updateFolderApi,
  togglePinApi,
  addAppletToFolderApi,
  removeAppletApi,
  transferOwnershipApi,
} from 'api';

import {
  deleteFolderById,
  setAppletsInFolder,
  updateFolders,
  addAppletToFolder as addAppletToFolderUtil,
  removeAppletFromFolder as removeAppletFromFolderUtil,
  changeFolder as changeFolderUtil,
} from './Folders.utils';

export const getAppletsForFolders = createAsyncThunk(
  'folders/getAppletsInFolders',
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
  'folders/getAppletsInFolder',
  async ({ folder }: { folder: Folder }, { rejectWithValue, signal }) => {
    try {
      const folderData = await getAppletsInFolderApi({ folderId: folder.id }, signal);

      return setAppletsInFolder({ folder, appletsInFolder: folderData.data });
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const saveFolder = createAsyncThunk(
  'folders/saveFolder',
  async (folder: FolderApplet, { getState, rejectWithValue, signal }) => {
    try {
      const response = await saveFolderApi(
        { folder: { name: folder.name!, parentId: folder.parentId! } },
        signal,
      );
      const { folders } = getState() as { folders: FoldersSchema };

      return updateFolders(
        folders,
        {
          ...folder,
          isNew: false,
          isRenaming: false,
        },
        response.data['_id'],
      );
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const updateFolder = createAsyncThunk(
  'folders/updateFolder',
  async (folder: FolderApplet, { getState, rejectWithValue, signal }) => {
    try {
      const response = await updateFolderApi(
        { folder: { name: folder.name!, parentId: folder.parentId! }, folderId: folder.id },
        signal,
      );
      const { folders } = getState() as { folders: FoldersSchema };

      return updateFolders(folders, { ...folder, name: response.data.name, isRenaming: false });
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const deleteFolder = createAsyncThunk(
  'folders/deleteFolder',
  async ({ folderId }: { folderId: string }, { getState, rejectWithValue, signal }) => {
    try {
      await deleteFolderApi({ folderId }, signal);
      const { folders } = getState() as { folders: FoldersSchema };

      return deleteFolderById(folders, folderId);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const togglePin = createAsyncThunk(
  'folders/togglePin',
  async (applet: FolderApplet, { getState, rejectWithValue, signal }) => {
    try {
      const pinState = !applet?.pinOrder;
      await togglePinApi(
        { applet: { id: applet.id, parentId: applet.parentId! }, isPinned: pinState },
        signal,
      );
      const { folders } = getState() as { folders: FoldersSchema };

      return updateFolders(folders, { ...applet, pinOrder: pinState ? 1 : 0 });
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const addAppletToFolder = createAsyncThunk(
  'folders/addAppletToFolder',
  async (
    { folder, applet }: { folder: FolderApplet; applet: FolderApplet },
    { getState, rejectWithValue, signal },
  ) => {
    try {
      await addAppletToFolderApi({ folderId: folder.id, appletId: applet.id }, signal);
      const { folders } = getState() as { folders: FoldersSchema };

      return addAppletToFolderUtil(folders.flattenFoldersApplets.data, folder, applet);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const changeFolder = createAsyncThunk(
  'folders/changeFolder',
  async (
    {
      previousFolder,
      applet,
      newFolder,
    }: { previousFolder: FolderApplet; applet: FolderApplet; newFolder: FolderApplet },
    { getState, rejectWithValue, signal },
  ) => {
    try {
      await removeAppletApi({ folderId: previousFolder.id, appletId: applet.id }, signal);
      await addAppletToFolderApi({ folderId: newFolder.id, appletId: applet.id }, signal);
      const { folders } = getState() as { folders: FoldersSchema };

      return changeFolderUtil(folders, previousFolder.id, applet, newFolder);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const removeAppletFromFolder = createAsyncThunk(
  'folders/removeAppletFromFolder',
  async (
    { applet, folderId }: { applet: FolderApplet; folderId?: string },
    { getState, rejectWithValue, signal },
  ) => {
    try {
      await removeAppletApi(
        { folderId: folderId || applet.parentId!, appletId: applet.id },
        signal,
      );
      const { folders } = getState() as { folders: FoldersSchema };

      return removeAppletFromFolderUtil(folders, applet);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

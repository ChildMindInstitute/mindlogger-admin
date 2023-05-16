import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ApiError, Folder, FolderApplet, FoldersSchema } from 'redux/modules';
import {
  saveFolderApi,
  deleteFolderApi,
  updateFolderApi,
  togglePinApi,
  addAppletToFolderApi,
  removeAppletFromFolderApi,
  getAppletSearchTermsApi,
  AppletId,
  setAppletEncryptionApi,
  getFoldersApi,
  getWorkspaceAppletsApi,
  GetAppletsParams,
  OwnerId,
  FolderId,
} from 'api';
import { Encryption } from 'shared/utils';

import {
  deleteFolderById,
  setAppletsInFolder,
  updateFolders,
  addAppletToFolder as addAppletToFolderUtil,
  removeAppletFromFolder as removeAppletFromFolderUtil,
  changeAppletEncryption as changeAppletEncryptionUtil,
  changeFolder as changeFolderUtil,
} from './Folders.utils';

export const getFolders = createAsyncThunk(
  'folders/getFolders',
  async ({ ownerId }: OwnerId, { rejectWithValue, signal }) => {
    try {
      return await getFoldersApi({ ownerId }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const getWorkspaceApplets = createAsyncThunk(
  'folders/getAppletsInFolders',
  async ({ params }: GetAppletsParams, { getState, dispatch }) => {
    let foldersData = [];
    const { folders } = getState() as { folders: FoldersSchema };

    const emptyFolders = folders.folders.data;

    if (emptyFolders.length) {
      foldersData = (
        await Promise.allSettled(
          emptyFolders.map(
            async (folder) => await dispatch(getAppletsForFolder({ params, folder })),
          ),
        )
      )
        .filter((folder) => folder.status === 'fulfilled')
        .map((folder) => (folder as PromiseFulfilledResult<any>).value.payload);
    }

    const applets = await dispatch(getAppletsOutsideFolders({ params }));

    return [...foldersData, ...(applets.payload as any).data.result];
  },
);

export const getAppletsOutsideFolders = createAsyncThunk(
  'folders/getAppletsInFolder',
  async ({ params }: GetAppletsParams, { rejectWithValue, signal }) => {
    try {
      return getWorkspaceAppletsApi({ params }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const getAppletsForFolder = createAsyncThunk(
  'folders/getAppletsInFolder',
  async (
    { params, folder }: GetAppletsParams & { folder: Folder },
    { rejectWithValue, signal },
  ) => {
    try {
      const folderData = await getWorkspaceAppletsApi(
        { params: { ...params, folderId: folder.id } },
        signal,
      );

      return setAppletsInFolder({ folder, appletsInFolder: folderData.data.result });
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const saveFolder = createAsyncThunk(
  'folders/saveFolder',
  async (
    { ownerId, folder }: OwnerId & { folder: FolderApplet },
    { getState, rejectWithValue, signal },
  ) => {
    try {
      const response = await saveFolderApi({ ownerId, name: folder.name as string }, signal);
      const { folders } = getState() as { folders: FoldersSchema };

      return updateFolders(
        folders,
        {
          ...folder,
          isNew: false,
          isRenaming: false,
        },
        response.data.result.id,
      );
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const updateFolder = createAsyncThunk(
  'folders/updateFolder',
  async (
    { ownerId, folder }: OwnerId & { folder: FolderApplet },
    { getState, rejectWithValue, signal },
  ) => {
    try {
      const response = await updateFolderApi(
        { ownerId, name: folder.name!, folderId: folder.id },
        signal,
      );
      const { folders } = getState() as { folders: FoldersSchema };

      return updateFolders(folders, {
        ...folder,
        name: response.data.result.name,
        isRenaming: false,
      });
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const deleteFolder = createAsyncThunk(
  'folders/deleteFolder',
  async ({ ownerId, folderId }: OwnerId & FolderId, { getState, rejectWithValue, signal }) => {
    try {
      await deleteFolderApi({ ownerId, folderId }, signal);
      const { folders } = getState() as { folders: FoldersSchema };

      return deleteFolderById(folders, folderId);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const togglePin = createAsyncThunk(
  'folders/togglePin',
  async (
    { ownerId, applet }: OwnerId & { applet: FolderApplet },
    { getState, rejectWithValue, signal },
  ) => {
    try {
      const pinState = !applet?.pinOrder;
      await togglePinApi(
        { ownerId, applet: { id: applet.id, parentId: applet.parentId! }, isPinned: pinState },
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
      await removeAppletFromFolderApi({ appletId: applet.id }, signal);
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
  async ({ applet }: { applet: FolderApplet }, { getState, rejectWithValue, signal }) => {
    try {
      await removeAppletFromFolderApi({ appletId: applet.id }, signal);
      const { folders } = getState() as { folders: FoldersSchema };

      return removeAppletFromFolderUtil(folders, applet);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const getAppletSearchTerms = createAsyncThunk(
  'folders/getAppletSearchTerms',
  async ({ appletId }: AppletId, { rejectWithValue, signal }) => {
    try {
      return getAppletSearchTermsApi({ appletId }, signal);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

export const setAppletEncryption = createAsyncThunk(
  'folders/setAppletEncryption',
  async (
    { appletId, encryption }: { appletId: string; encryption: Encryption },
    { getState, rejectWithValue, signal },
  ) => {
    try {
      await setAppletEncryptionApi({ appletId, encryption }, signal);
      const { folders } = getState() as { folders: FoldersSchema };

      return changeAppletEncryptionUtil(folders, appletId, encryption);
    } catch (exception) {
      return rejectWithValue(exception as AxiosError<ApiError>);
    }
  },
);

import { AxiosError } from 'axios';
import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { ErrorResponse } from 'redux/modules/Base';

import { FolderApplet, FoldersSchema } from './Folders.schema';
import { deleteFolder, getAppletsForFolders, saveFolder, updateFolder } from './Folders.thunk';
import { state as initialState } from './Folders.state';
import { flatFoldersApplets } from './Folders.utils';

export const reducers = {
  createNewFolder: (state: FoldersSchema, action: PayloadAction<FolderApplet>): void => {
    state.flattenFoldersApplets = [action.payload, ...state.flattenFoldersApplets];
  },
  deleteNewFolder: (state: FoldersSchema, action: PayloadAction<{ folderId: string }>): void => {
    const folderIndex = state.flattenFoldersApplets.findIndex(
      (folderApplet) => folderApplet.id === action.payload.folderId,
    );
    state.flattenFoldersApplets.splice(folderIndex, 1);
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<FoldersSchema>): void => {
  builder.addCase(getAppletsForFolders.pending, ({ foldersApplets }, action) => {
    if (foldersApplets.status !== 'loading') {
      foldersApplets.requestId = action.meta.requestId;
      foldersApplets.status = 'loading';
    }
  });

  builder.addCase(getAppletsForFolders.fulfilled, (state, action) => {
    const { foldersApplets } = state;
    if (foldersApplets.status === 'loading' && foldersApplets.requestId === action.meta.requestId) {
      foldersApplets.requestId = initialState.foldersApplets.requestId;
      foldersApplets.status = 'success';
      foldersApplets.data = action.payload;
      state.flattenFoldersApplets = action.payload
        .map((folderApplet) => flatFoldersApplets(folderApplet))
        .flat();
    }
  });

  builder.addCase(getAppletsForFolders.rejected, ({ foldersApplets }, action) => {
    if (foldersApplets.status === 'loading' && foldersApplets.requestId === action.meta.requestId) {
      const error = action.payload as AxiosError;
      foldersApplets.requestId = initialState.foldersApplets.requestId;
      foldersApplets.status = 'error';
      foldersApplets.error = error.response?.data as AxiosError<ErrorResponse>;
    }
  });

  builder.addCase(saveFolder.pending, ({ foldersApplets }, action) => {
    if (foldersApplets.status !== 'loading') {
      foldersApplets.requestId = action.meta.requestId;
      foldersApplets.status = 'loading';
    }
  });

  builder.addCase(saveFolder.fulfilled, (state, action) => {
    const { foldersApplets } = state;
    if (foldersApplets.status === 'loading' && foldersApplets.requestId === action.meta.requestId) {
      foldersApplets.requestId = initialState.foldersApplets.requestId;
      foldersApplets.status = 'success';

      state.flattenFoldersApplets = action.payload;
    }
  });

  builder.addCase(deleteFolder.pending, (state, action) => {
    const { foldersApplets } = state;
    if (foldersApplets.status !== 'loading') {
      foldersApplets.requestId = action.meta.requestId;
      foldersApplets.status = 'loading';
    }
  });

  builder.addCase(deleteFolder.fulfilled, (state, action) => {
    const { foldersApplets } = state;
    if (foldersApplets.status === 'loading' && foldersApplets.requestId === action.meta.requestId) {
      foldersApplets.requestId = initialState.foldersApplets.requestId;
      foldersApplets.status = 'success';
      state.flattenFoldersApplets = action.payload;
    }
  });

  builder.addCase(updateFolder.pending, (state, action) => {
    const { foldersApplets } = state;
    if (foldersApplets.status !== 'loading') {
      foldersApplets.requestId = action.meta.requestId;
      foldersApplets.status = 'loading';
    }
  });

  builder.addCase(updateFolder.fulfilled, (state, action) => {
    const { foldersApplets } = state;
    if (foldersApplets.status === 'loading' && foldersApplets.requestId === action.meta.requestId) {
      foldersApplets.requestId = initialState.foldersApplets.requestId;
      foldersApplets.status = 'success';
      state.flattenFoldersApplets = action.payload;
    }
  });
};

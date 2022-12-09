import { AxiosError } from 'axios';
import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { ErrorResponse } from 'redux/modules/Base';

import { FolderApplet, FoldersSchema } from './Folders.schema';
import {
  deleteFolder,
  getAppletsForFolders,
  saveFolder,
  togglePin,
  updateFolder,
} from './Folders.thunk';
import { state as initialState } from './Folders.state';
import { createFoldersPendingData, flatFoldersApplets } from './Folders.utils';

export const reducers = {
  expandFolder: (state: FoldersSchema, action: PayloadAction<FolderApplet>): void => {
    state.flattenFoldersApplets = state.flattenFoldersApplets.map((item) => {
      if (item.id === action.payload.id) {
        return { ...item, isExpanded: !action.payload.isExpanded };
      }
      if (item.parentId === action.payload.id) {
        return { ...item, isVisible: !action.payload.isExpanded };
      }

      return item;
    });
  },
  createNewFolder: (state: FoldersSchema, action: PayloadAction<FolderApplet>): void => {
    state.flattenFoldersApplets = [action.payload, ...state.flattenFoldersApplets];
  },
  deleteNewFolder: (state: FoldersSchema, action: PayloadAction<{ folderId: string }>): void => {
    state.flattenFoldersApplets = state.flattenFoldersApplets.filter(
      (folderApplet) => folderApplet.id !== action.payload.folderId,
    );
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<FoldersSchema>): void => {
  builder.addCase(getAppletsForFolders.pending, ({ foldersApplets }, action) => {
    createFoldersPendingData(foldersApplets, action.meta.requestId);
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
    createFoldersPendingData(foldersApplets, action.meta.requestId);
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
    createFoldersPendingData(foldersApplets, action.meta.requestId);
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
    createFoldersPendingData(foldersApplets, action.meta.requestId);
  });

  builder.addCase(updateFolder.fulfilled, (state, action) => {
    const { foldersApplets } = state;
    if (foldersApplets.status === 'loading' && foldersApplets.requestId === action.meta.requestId) {
      foldersApplets.requestId = initialState.foldersApplets.requestId;
      foldersApplets.status = 'success';
      state.flattenFoldersApplets = action.payload;
    }
  });

  builder.addCase(togglePin.pending, (state, action) => {
    const { foldersApplets } = state;
    createFoldersPendingData(foldersApplets, action.meta.requestId);
  });

  builder.addCase(togglePin.fulfilled, (state, action) => {
    const { foldersApplets } = state;
    if (foldersApplets.status === 'loading' && foldersApplets.requestId === action.meta.requestId) {
      foldersApplets.requestId = initialState.foldersApplets.requestId;
      foldersApplets.status = 'success';
      state.flattenFoldersApplets = action.payload;
    }
  });
};

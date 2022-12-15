import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { createPendingData, createRejectedData } from 'redux/store/utils';

import { FolderApplet, FoldersSchema } from './Folders.schema';
import {
  addAppletToFolder,
  changeFolder,
  deleteFolder,
  getAppletsForFolders,
  removeAppletFromFolder,
  saveFolder,
  togglePin,
  updateFolder,
} from './Folders.thunk';
import { state as initialState } from './Folders.state';
import { flatFoldersApplets, updateFlattenFoldersApplets } from './Folders.utils';

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
  createPendingData(builder, getAppletsForFolders, 'foldersApplets');

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

  createRejectedData(builder, getAppletsForFolders, 'foldersApplets');

  createPendingData(builder, saveFolder, 'foldersApplets');

  builder.addCase(saveFolder.fulfilled, (state, action) => {
    updateFlattenFoldersApplets(state, action.meta.requestId, action.payload);
  });

  createPendingData(builder, deleteFolder, 'foldersApplets');

  builder.addCase(deleteFolder.fulfilled, (state, action) => {
    updateFlattenFoldersApplets(state, action.meta.requestId, action.payload);
  });

  createPendingData(builder, updateFolder, 'foldersApplets');

  builder.addCase(updateFolder.fulfilled, (state, action) => {
    updateFlattenFoldersApplets(state, action.meta.requestId, action.payload);
  });

  createPendingData(builder, togglePin, 'foldersApplets');

  builder.addCase(togglePin.fulfilled, (state, action) => {
    updateFlattenFoldersApplets(state, action.meta.requestId, action.payload);
  });

  createPendingData(builder, addAppletToFolder, 'foldersApplets');

  builder.addCase(addAppletToFolder.fulfilled, (state, action) => {
    updateFlattenFoldersApplets(state, action.meta.requestId, action.payload);
  });

  createPendingData(builder, removeAppletFromFolder, 'foldersApplets');

  builder.addCase(removeAppletFromFolder.fulfilled, (state, action) => {
    updateFlattenFoldersApplets(state, action.meta.requestId, action.payload);
  });

  createPendingData(builder, changeFolder, 'foldersApplets');

  builder.addCase(changeFolder.fulfilled, (state, action) => {
    updateFlattenFoldersApplets(state, action.meta.requestId, action.payload);
  });
};

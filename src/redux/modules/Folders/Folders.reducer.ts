import { AxiosError } from 'axios';
import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { ErrorResponse } from 'redux/modules/Base';

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
  getAppletSearchTerms,
} from './Folders.thunk';
import { state as initialState } from './Folders.state';
import {
  createFoldersPendingData,
  flatFoldersApplets,
  updateFlattenFoldersApplets,
} from './Folders.utils';

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
  updateAppletData: (
    state: FoldersSchema,
    action: PayloadAction<{ appletId: string; published?: boolean; appletName?: string }>,
  ): void => {
    const appletToUpdate = state.flattenFoldersApplets.find(
      (applet) => applet.id === action.payload.appletId,
    );
    const updatedApplet = {
      ...appletToUpdate,
      published: action.payload.published,
      name: action.payload.appletName || appletToUpdate?.name,
      updated: new Date().toLocaleString(),
    };
    if (updatedApplet?.id) {
      state.flattenFoldersApplets = [
        ...state.flattenFoldersApplets.filter((item) => item.isFolder),
        updatedApplet,
        ...state.flattenFoldersApplets.filter(
          (applet) => !applet.isFolder && applet.id !== action.payload.appletId,
        ),
      ] as FolderApplet[];
    }
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
    updateFlattenFoldersApplets(state, action.meta.requestId, action.payload);
  });

  builder.addCase(deleteFolder.pending, (state, action) => {
    const { foldersApplets } = state;
    createFoldersPendingData(foldersApplets, action.meta.requestId);
  });

  builder.addCase(deleteFolder.fulfilled, (state, action) => {
    updateFlattenFoldersApplets(state, action.meta.requestId, action.payload);
  });

  builder.addCase(updateFolder.pending, (state, action) => {
    const { foldersApplets } = state;
    createFoldersPendingData(foldersApplets, action.meta.requestId);
  });

  builder.addCase(updateFolder.fulfilled, (state, action) => {
    updateFlattenFoldersApplets(state, action.meta.requestId, action.payload);
  });

  builder.addCase(togglePin.pending, (state, action) => {
    const { foldersApplets } = state;
    createFoldersPendingData(foldersApplets, action.meta.requestId);
  });

  builder.addCase(togglePin.fulfilled, (state, action) => {
    updateFlattenFoldersApplets(state, action.meta.requestId, action.payload);
  });

  builder.addCase(addAppletToFolder.pending, (state, action) => {
    const { foldersApplets } = state;
    createFoldersPendingData(foldersApplets, action.meta.requestId);
  });

  builder.addCase(addAppletToFolder.fulfilled, (state, action) => {
    updateFlattenFoldersApplets(state, action.meta.requestId, action.payload);
  });

  builder.addCase(removeAppletFromFolder.pending, (state, action) => {
    const { foldersApplets } = state;
    createFoldersPendingData(foldersApplets, action.meta.requestId);
  });

  builder.addCase(removeAppletFromFolder.fulfilled, (state, action) => {
    updateFlattenFoldersApplets(state, action.meta.requestId, action.payload);
  });

  builder.addCase(changeFolder.pending, (state, action) => {
    const { foldersApplets } = state;
    createFoldersPendingData(foldersApplets, action.meta.requestId);
  });

  builder.addCase(changeFolder.fulfilled, (state, action) => {
    updateFlattenFoldersApplets(state, action.meta.requestId, action.payload);
  });
  builder.addCase(getAppletSearchTerms.pending, ({ appletsSearchTerms }, action) => {
    if (appletsSearchTerms.status !== 'loading') {
      appletsSearchTerms.requestId = action.meta.requestId;
      appletsSearchTerms.status = 'loading';
    }
  });
  builder.addCase(getAppletSearchTerms.fulfilled, ({ appletsSearchTerms }, action) => {
    if (
      appletsSearchTerms.status === 'loading' &&
      appletsSearchTerms.requestId === action.meta.requestId
    ) {
      appletsSearchTerms.requestId = initialState.appletsSearchTerms.requestId;
      appletsSearchTerms.status = 'success';
      appletsSearchTerms.data = {
        ...appletsSearchTerms.data,
        [action.meta.arg.appletId]: action.payload.data,
      };
    }
  });
  builder.addCase(getAppletSearchTerms.rejected, ({ appletsSearchTerms }, action) => {
    if (
      appletsSearchTerms.status === 'loading' &&
      appletsSearchTerms.requestId === action.meta.requestId
    ) {
      const error = action.payload as AxiosError;
      appletsSearchTerms.requestId = initialState.appletsSearchTerms.requestId;
      appletsSearchTerms.status = 'error';
      appletsSearchTerms.error = error.response?.data as AxiosError<ErrorResponse>;
    }
  });
};

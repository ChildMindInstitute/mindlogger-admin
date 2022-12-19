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
  createFlattenFoldersAppletsPendingData,
  createFlattenFoldersAppletsFulfilledData,
  createFlattenFoldersAppletsRejectedData,
  flatFoldersApplets,
} from './Folders.utils';

export const reducers = {
  expandFolder: (state: FoldersSchema, action: PayloadAction<FolderApplet>): void => {
    state.flattenFoldersApplets.data = state.flattenFoldersApplets.data.map((item) => {
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
    state.flattenFoldersApplets.data = [action.payload, ...state.flattenFoldersApplets.data];
  },
  deleteFolderApplet: (state: FoldersSchema, action: PayloadAction<{ id: string }>): void => {
    state.flattenFoldersApplets.data = state.flattenFoldersApplets.data.filter(
      (folderApplet) => folderApplet.id !== action.payload.id,
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
      state.flattenFoldersApplets.data = action.payload
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

  builder.addCase(saveFolder.pending, (state, action) => {
    createFlattenFoldersAppletsPendingData(state, action.meta.requestId);
  });

  builder.addCase(saveFolder.fulfilled, (state, action) => {
    createFlattenFoldersAppletsFulfilledData(state, action.meta.requestId, action.payload);
  });

  builder.addCase(saveFolder.rejected, (state, action) => {
    createFlattenFoldersAppletsRejectedData(
      state,
      action.meta.requestId,
      action.payload as AxiosError,
    );
  });

  builder.addCase(deleteFolder.pending, (state, action) => {
    createFlattenFoldersAppletsPendingData(state, action.meta.requestId);
  });

  builder.addCase(deleteFolder.fulfilled, (state, action) => {
    createFlattenFoldersAppletsFulfilledData(state, action.meta.requestId, action.payload);
  });

  builder.addCase(updateFolder.pending, (state, action) => {
    createFlattenFoldersAppletsPendingData(state, action.meta.requestId);
  });

  builder.addCase(updateFolder.fulfilled, (state, action) => {
    createFlattenFoldersAppletsFulfilledData(state, action.meta.requestId, action.payload);
  });

  builder.addCase(updateFolder.rejected, (state, action) => {
    createFlattenFoldersAppletsRejectedData(
      state,
      action.meta.requestId,
      action.payload as AxiosError,
    );
  });

  builder.addCase(togglePin.pending, (state, action) => {
    createFlattenFoldersAppletsPendingData(state, action.meta.requestId);
  });

  builder.addCase(togglePin.fulfilled, (state, action) => {
    createFlattenFoldersAppletsFulfilledData(state, action.meta.requestId, action.payload);
  });

  builder.addCase(addAppletToFolder.pending, (state, action) => {
    createFlattenFoldersAppletsPendingData(state, action.meta.requestId);
  });

  builder.addCase(addAppletToFolder.fulfilled, (state, action) => {
    createFlattenFoldersAppletsFulfilledData(state, action.meta.requestId, action.payload);
  });

  builder.addCase(removeAppletFromFolder.pending, (state, action) => {
    createFlattenFoldersAppletsPendingData(state, action.meta.requestId);
  });

  builder.addCase(removeAppletFromFolder.fulfilled, (state, action) => {
    createFlattenFoldersAppletsFulfilledData(state, action.meta.requestId, action.payload);
  });

  builder.addCase(changeFolder.pending, (state, action) => {
    createFlattenFoldersAppletsPendingData(state, action.meta.requestId);
  });

  builder.addCase(changeFolder.fulfilled, (state, action) => {
    createFlattenFoldersAppletsFulfilledData(state, action.meta.requestId, action.payload);
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

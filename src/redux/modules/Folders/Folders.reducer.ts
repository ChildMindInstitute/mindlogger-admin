import { AxiosError } from 'axios';
import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

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
  flatFoldersApplets,
  createPendingData,
  createFulfilledData,
  createRejectedData,
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
    state.flattenFoldersApplets.data = state.flattenFoldersApplets.data.map((item) => {
      if (item.id === action.payload.appletId) {
        return {
          ...item,
          published: action.payload.published,
          name: action.payload.appletName || item.name,
          updated: new Date().toLocaleString(),
        };
      }

      return item;
    });
  },
};

export const extraReducers = (builder: ActionReducerMapBuilder<FoldersSchema>): void => {
  builder.addCase(getAppletsForFolders.pending, (state, action) => {
    createPendingData(state, 'foldersApplets', action.meta.requestId);
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

  builder.addCase(getAppletsForFolders.rejected, (state, action) => {
    createRejectedData(
      state,
      'foldersApplets',
      action.meta.requestId,
      action.payload as AxiosError,
    );
  });

  builder.addCase(saveFolder.pending, (state, action) => {
    createPendingData(state, 'flattenFoldersApplets', action.meta.requestId);
  });

  builder.addCase(saveFolder.fulfilled, (state, action) => {
    createFulfilledData(state, 'flattenFoldersApplets', action.meta.requestId, action.payload);
  });

  builder.addCase(saveFolder.rejected, (state, action) => {
    createRejectedData(
      state,
      'flattenFoldersApplets',
      action.meta.requestId,
      action.payload as AxiosError,
    );
  });

  builder.addCase(deleteFolder.pending, (state, action) => {
    createPendingData(state, 'flattenFoldersApplets', action.meta.requestId);
  });

  builder.addCase(deleteFolder.fulfilled, (state, action) => {
    createFulfilledData(state, 'flattenFoldersApplets', action.meta.requestId, action.payload);
  });

  builder.addCase(updateFolder.pending, (state, action) => {
    createPendingData(state, 'flattenFoldersApplets', action.meta.requestId);
  });

  builder.addCase(updateFolder.fulfilled, (state, action) => {
    createFulfilledData(state, 'flattenFoldersApplets', action.meta.requestId, action.payload);
  });

  builder.addCase(updateFolder.rejected, (state, action) => {
    createRejectedData(
      state,
      'flattenFoldersApplets',
      action.meta.requestId,
      action.payload as AxiosError,
    );
  });

  builder.addCase(togglePin.pending, (state, action) => {
    createPendingData(state, 'flattenFoldersApplets', action.meta.requestId);
  });

  builder.addCase(togglePin.fulfilled, (state, action) => {
    createFulfilledData(state, 'flattenFoldersApplets', action.meta.requestId, action.payload);
  });

  builder.addCase(addAppletToFolder.pending, (state, action) => {
    createPendingData(state, 'flattenFoldersApplets', action.meta.requestId);
  });

  builder.addCase(addAppletToFolder.fulfilled, (state, action) => {
    createFulfilledData(state, 'flattenFoldersApplets', action.meta.requestId, action.payload);
  });

  builder.addCase(removeAppletFromFolder.pending, (state, action) => {
    createPendingData(state, 'flattenFoldersApplets', action.meta.requestId);
  });

  builder.addCase(removeAppletFromFolder.fulfilled, (state, action) => {
    createFulfilledData(state, 'flattenFoldersApplets', action.meta.requestId, action.payload);
  });

  builder.addCase(changeFolder.pending, (state, action) => {
    createPendingData(state, 'flattenFoldersApplets', action.meta.requestId);
  });

  builder.addCase(changeFolder.fulfilled, (state, action) => {
    createFulfilledData(state, 'flattenFoldersApplets', action.meta.requestId, action.payload);
  });
  builder.addCase(getAppletSearchTerms.pending, (state, action) => {
    createPendingData(state, 'appletsSearchTerms', action.meta.requestId);
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
  builder.addCase(getAppletSearchTerms.rejected, (state, action) => {
    createRejectedData(
      state,
      'appletsSearchTerms',
      action.meta.requestId,
      action.payload as AxiosError,
    );
  });
};

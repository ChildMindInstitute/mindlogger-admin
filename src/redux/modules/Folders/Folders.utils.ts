import { Draft } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  AppletResponse,
  Folder,
  FolderApplet,
  FoldersSchema,
  LoadedFolder,
  LoadedFolderApplet,
  ErrorResponse,
} from 'redux/modules';
import { state as initialState } from './Folders.state';

export const flatFoldersApplets = (item: FolderApplet): FolderApplet[] => {
  const folderApplet = { ...item };
  folderApplet.isNew = false;
  if (!folderApplet.depth) {
    folderApplet.depth = 0;
  }
  folderApplet.isVisible = folderApplet.depth <= 0;
  if (!folderApplet.isFolder) {
    return [folderApplet];
  }
  folderApplet.isExpanded = false;
  if (!folderApplet.items) {
    return [folderApplet];
  }
  folderApplet.items = folderApplet.items
    .map((_item) =>
      flatFoldersApplets({
        ..._item,
        parentId: folderApplet.id,
        depth: (folderApplet.depth || 0) + 1,
      }),
    )
    .flat();

  return [folderApplet, ...folderApplet.items];
};

const removeDuplicateApplets = (loadedFolder: LoadedFolder) => {
  const hash: { [key: string]: LoadedFolderApplet } = {};
  if (!loadedFolder.items.length) return;

  loadedFolder.items.forEach((applet) => {
    if (applet.id) {
      if (hash[applet.id]) return;

      hash[applet.id] = applet;
    }
  });

  loadedFolder.items = Object.values(hash);
};

export const setAppletsInFolder = ({
  folder,
  appletsInFolder,
}: {
  folder: Folder;
  appletsInFolder: AppletResponse[];
}) => {
  const loadedFolder: LoadedFolder = { ...folder, isFolder: true, items: [] };
  if (appletsInFolder.length > 0) {
    const items = appletsInFolder.map((appletInfo: AppletResponse) => {
      const applet = { ...appletInfo };
      if (!appletInfo.name && appletInfo.applet) {
        applet.name = appletInfo.applet.displayName;
      }
      if (!appletInfo.id) {
        applet.id = appletInfo.applet['_id'].split('/')[1];
      }
      if (!appletInfo?.encryption && appletInfo.applet) {
        applet.encryption = appletInfo.applet.encryption;
      }

      return {
        ...applet,
        isExpanded: false,
        isFolder: false,
        isChild: true,
      };
    });

    loadedFolder.items = items;
    removeDuplicateApplets(loadedFolder);
  }

  return loadedFolder;
};

export const updateFolders = (folders: FoldersSchema, folder: FolderApplet, updatedId?: string) =>
  folders.flattenFoldersApplets.data.map((folderApplet) => {
    if (folderApplet.id === folder.id) {
      return { ...folder, id: updatedId || folder.id };
    }

    return folderApplet;
  });

export const deleteFolderById = (folders: FoldersSchema, folderId: string) =>
  folders.flattenFoldersApplets.data.filter((folderApplet) => folderApplet.id !== folderId);

export const addAppletToFolder = (
  folders: FolderApplet[],
  folder: FolderApplet,
  applet: FolderApplet,
) =>
  folders.map((folderApplet) => {
    if (folderApplet.id === applet.id) {
      return {
        ...folderApplet,
        parentId: folder.id,
        depth: 1,
        isVisible: folder.isExpanded,
      };
    }
    if (folderApplet.id === folder.id) {
      const items = folderApplet?.items || [];

      return {
        ...folderApplet,
        items: [...items, applet],
      };
    }

    return folderApplet;
  });

export const removeAppletFromFolder = (folders: FoldersSchema, applet: FolderApplet) =>
  folders.flattenFoldersApplets.data.map((folderApplet) => {
    if (folderApplet.id === applet.id) {
      return {
        ...applet,
        parentId: undefined,
        depth: 0,
        isVisible: true,
      };
    }
    if (folderApplet.id === applet.parentId) {
      const items = (folderApplet?.items || []).filter((item) => item.id !== applet.id);

      return {
        ...folderApplet,
        isExpanded: items.length ? folderApplet.isExpanded : false,
        items,
      };
    }

    return folderApplet;
  });

export const changeFolder = (
  folders: FoldersSchema,
  previousFolderId: string,
  applet: FolderApplet,
  newFolder: FolderApplet,
) =>
  folders.flattenFoldersApplets.data.map((folderApplet) => {
    if (folderApplet.id === applet.id) {
      return {
        ...applet,
        parentId: newFolder.id,
        depth: 1,
        isVisible: newFolder.isExpanded,
      };
    }
    const items = folderApplet?.items || [];
    if (folderApplet.id === previousFolderId) {
      const filteredItems = items.filter((item) => item.id !== applet.id);

      return {
        ...folderApplet,
        isExpanded: filteredItems.length ? folderApplet.isExpanded : false,
        items: filteredItems,
      };
    }
    if (folderApplet.id === newFolder.id) {
      return {
        ...folderApplet,
        items: [...items, applet],
      };
    }

    return folderApplet;
  });

export const createPendingData = (
  state: Draft<FoldersSchema>,
  property: keyof FoldersSchema,
  requestId: string,
) => {
  if (state[property].status !== 'loading') {
    state[property].requestId = requestId;
    state[property].status = 'loading';
  }
};

export const createFulfilledData = (
  state: Draft<FoldersSchema>,
  property: keyof FoldersSchema,
  requestId: string,
  payload: FolderApplet[],
) => {
  if (state[property].status === 'loading' && state[property].requestId === requestId) {
    state[property].requestId = initialState[property].requestId;
    state[property].status = 'success';
    state[property].data = payload;
  }
};

export const createRejectedData = (
  state: Draft<FoldersSchema>,
  property: keyof FoldersSchema,
  requestId: string,
  error: AxiosError,
) => {
  if (state[property].status === 'loading' && state[property].requestId === requestId) {
    state[property].requestId = initialState[property].requestId;
    state[property].status = 'error';
    state[property].error = error.response?.data as AxiosError<ErrorResponse>;
    state[property].data ? state[property].data : null;
  }
};

export const changeAppletEncryption = (
  folders: FoldersSchema,
  appletId: string,
  encryptionData: FormData,
) =>
  folders.flattenFoldersApplets.data.map((folderApplet) => {
    if (folderApplet.id === appletId) {
      const encryptionString = encryptionData.get('encryption')?.toString();
      const encryption = JSON.parse(encryptionString || '');

      return {
        ...folderApplet,
        encryption,
      };
    }

    return folderApplet;
  });

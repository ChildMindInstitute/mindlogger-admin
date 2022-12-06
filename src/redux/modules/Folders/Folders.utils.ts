import {
  AppletResponse,
  Folder,
  FolderApplet,
  FoldersSchema,
  LoadedFolder,
  LoadedFolderApplet,
} from 'redux/modules';

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

export const updateFolders = (folders: FoldersSchema, folder: FolderApplet, updatedId?: string) => {
  const flattenFoldersApplets = [...folders.flattenFoldersApplets];
  const folderIndex = flattenFoldersApplets.findIndex(
    (flattenFolder) => flattenFolder.id === folder.id,
  );
  flattenFoldersApplets.splice(folderIndex, 1, { ...folder, id: updatedId || folder.id });

  return flattenFoldersApplets;
};

export const deleteFolderById = (folders: FoldersSchema, folderId: string) => {
  const flattenFoldersApplets = [...folders.flattenFoldersApplets];
  const folderIndex = flattenFoldersApplets.findIndex((folder) => folder.id === folderId);
  flattenFoldersApplets.splice(folderIndex, 1);

  return flattenFoldersApplets;
};

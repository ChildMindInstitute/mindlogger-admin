import { Folder } from 'redux/modules';

export type AppletResponse = {
  accountId: string;
  activities: {
    [key: string]: string;
  };
  activityFlows: Record<string, string>;
  applet: {
    description: string;
    displayName: string;
    editing: boolean;
    encryption: {
      appletPrime: number[];
      appletPublicKey: number[];
      base: number[];
    };
    image: string;
    largeApplet: boolean;
    themeId: string;
    url: string;
    version: string;
    _id: string;
  };
  encryption?: {
    appletPrime: number[];
    appletPublicKey: number[];
    base: number[];
  };
  hasUrl: boolean;
  id?: string;
  name?: string;
  published: boolean;
  roles: string[];
  updated: string;
};

export type LoadedFolderApplet = AppletResponse &
  Partial<{
    isFolder: boolean;
    isChild: boolean;
    isExpanded: boolean;
  }>;

export type LoadedFolder = Folder &
  Partial<AppletResponse> & {
    isFolder: boolean;
    isExpanded?: boolean;
    items: LoadedFolderApplet[];
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

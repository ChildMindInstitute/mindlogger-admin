import { folders } from 'modules/Dashboard/state';
import { applet } from 'shared/state';

export const useAppletDataOrFolderData = (appletId?: string, isBuilder = false) => {
  if (!appletId) return;

  if (isBuilder) {
    const appletData = applet.useAppletData()?.result;

    return {
      id: appletData?.id,
      name: appletData?.displayName,
    };
  }

  const folderData = folders.useApplet(appletId);

  return {
    id: folderData?.id,
    name: folderData?.name,
  };
};

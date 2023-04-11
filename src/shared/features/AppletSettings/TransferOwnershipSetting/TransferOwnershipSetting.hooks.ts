import { folders } from 'modules/Dashboard/state';
import { applet } from 'shared/state';

export const useAppletDataOrFolderData = (appletId?: string, isBuilder = false) => {
  if (!appletId) return;

  if (isBuilder) return applet.useAppletData()?.result;

  return folders.useApplet(appletId);
};

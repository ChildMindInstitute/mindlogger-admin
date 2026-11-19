import { Applet, DashboardAppletType } from 'api';
import { Roles } from 'shared/consts';
import { isManagerOrOwnerOrEditor } from 'shared/utils';

import { CopyTargetApplet } from './CopyActivityModal.types';

// Applets the user can edit, without the one being edited
export const getCopyTargetApplets = (applets: Applet[], currentAppletId?: string) =>
  applets.reduce((acc: CopyTargetApplet[], { id, type, displayName, image, role }) => {
    if (
      type === DashboardAppletType.Applet &&
      id !== currentAppletId &&
      isManagerOrOwnerOrEditor(role as Roles)
    ) {
      acc.push({ id, appletName: displayName, image });
    }

    return acc;
  }, []);

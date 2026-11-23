import { t } from 'i18next';

import { Applet, DashboardAppletType } from 'api';
import { Option } from 'shared/components/FormComponents/SelectController/SelectController.types';
import { Roles } from 'shared/consts';
import { Workspace } from 'shared/state';
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

// The user's own workspace first, then shared ones
export const getCopyTargetWorkspaces = (workspaces: Workspace[], userId?: string): Option[] =>
  [...workspaces]
    .sort((a, b) => Number(b.ownerId === userId) - Number(a.ownerId === userId))
    .map(({ ownerId, workspaceName }) => ({
      value: ownerId,
      labelKey: t(ownerId === userId ? 'copyActivityMyWorkspace' : 'copyActivitySharedWorkspace', {
        name: workspaceName,
      }),
    }));

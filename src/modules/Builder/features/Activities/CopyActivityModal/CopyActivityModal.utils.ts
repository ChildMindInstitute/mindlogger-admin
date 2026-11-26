import { t } from 'i18next';

import { Applet, DashboardAppletType, getWorkspaceAppletsApi, getWorkspaceRolesApi } from 'api';
import { Option } from 'shared/components/FormComponents/SelectController/SelectController.types';
import { AppletRoles, Workspace } from 'shared/state';
import { checkIfCanEdit } from 'shared/utils';

import { CopyTargetApplet, GetCopyTargetsParams } from './CopyActivityModal.types';

// Loads the applets with all the user's roles in them, as the applets list has only the top role
export const getCopyTargetsApi = async (body: GetCopyTargetsParams) => {
  const [appletsResponse, rolesResponse] = await Promise.all([
    getWorkspaceAppletsApi(body),
    getWorkspaceRolesApi({ ownerId: body.params.ownerId }),
  ]);

  return {
    ...appletsResponse,
    data: { ...appletsResponse.data, roles: rolesResponse.data?.result as AppletRoles },
  };
};

// Applets the user can edit, without the one being edited
export const getCopyTargetApplets = (
  applets: Applet[],
  roles: AppletRoles,
  currentAppletId?: string,
) =>
  applets.reduce((acc: CopyTargetApplet[], { id, type, displayName, image }) => {
    if (
      type === DashboardAppletType.Applet &&
      id !== currentAppletId &&
      checkIfCanEdit(roles[id])
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

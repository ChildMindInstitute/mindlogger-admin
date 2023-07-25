import { Roles } from 'shared/consts';
import { BaseSchema, Workspace } from 'shared/state';
import { User } from 'modules/Auth';

export const getIsAddAppletBtnVisible = (
  currentWorkspace: Workspace | null,
  rolesData: BaseSchema<Record<string, Roles[]> | null>,
  user?: User,
) =>
  currentWorkspace?.ownerId === user?.id ||
  Object.values(rolesData?.data || {}).some(
    (roles) => roles.includes(Roles.Manager) || roles.includes(Roles.Editor),
  );

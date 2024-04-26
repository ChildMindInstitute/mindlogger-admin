import { Roles } from 'shared/consts';

export const hasPermissionToViewData = (roles?: Roles[] | null) => {
  if (!roles?.length) return false;

  return (
    roles.includes(Roles.SuperAdmin) ||
    roles.includes(Roles.Owner) ||
    roles.includes(Roles.Manager) ||
    roles.includes(Roles.Reviewer)
  );
};

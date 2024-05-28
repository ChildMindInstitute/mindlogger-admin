import { Roles } from 'shared/consts';

export const isManagerOrOwner = (role?: Roles) => role === Roles.Manager || role === Roles.Owner;

export const isManagerOrOwnerOrEditor = (role?: Roles) =>
  isManagerOrOwner(role) || role === Roles.Editor;

export const checkIfCanEdit = (roles?: Roles[]) =>
  Boolean(
    isManagerOrOwner(roles?.[0]) ||
      roles?.includes(Roles.Editor) ||
      roles?.includes(Roles.SuperAdmin),
  );

export const checkIfCanAccessData = (roles?: Roles[]) =>
  Boolean(
    isManagerOrOwner(roles?.[0]) ||
      roles?.includes(Roles.SuperAdmin) ||
      roles?.includes(Roles.Reviewer),
  );

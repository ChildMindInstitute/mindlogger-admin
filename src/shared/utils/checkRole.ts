import { Roles } from 'shared/consts';

export const isManagerOrOwner = (role?: Roles) => role === Roles.Manager || role === Roles.Owner;

export const checkIfFullAccess = (roles?: Roles[]) =>
  Boolean(isManagerOrOwner(roles?.[0]) || roles?.includes(Roles.SuperAdmin));

export const isManagerOrOwnerOrEditor = (role?: Roles) =>
  isManagerOrOwner(role) || role === Roles.Editor;

export const checkIfCanEdit = (roles?: Roles[]) =>
  Boolean(checkIfFullAccess(roles) || roles?.includes(Roles.Editor));

export const checkIfCanAccessData = (roles?: Roles[]) =>
  Boolean(checkIfFullAccess(roles) || roles?.includes(Roles.Reviewer));

export const checkIfCanManageParticipants = (roles?: Roles[]) =>
  Boolean(checkIfFullAccess(roles) || roles?.includes(Roles.Coordinator));

export const checkIfCanTakeNow = (roles?: Roles[]) =>
  Boolean(checkIfFullAccess(roles) || roles?.includes(Roles.Reviewer));

export const checkIfCanViewParticipants = (roles?: Roles[]) =>
  Boolean(
    checkIfFullAccess(roles) ||
      roles?.includes(Roles.Reviewer) ||
      roles?.includes(Roles.Coordinator),
  );

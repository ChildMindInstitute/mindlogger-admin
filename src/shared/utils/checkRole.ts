import { Roles } from 'shared/consts';

export const isManagerOrOwner = (role?: Roles) => role === Roles.Manager || role === Roles.Owner;

export const isManagerOrOwnerOrEditor = (role?: Roles) => isManagerOrOwner(role) || role === Roles.Editor;

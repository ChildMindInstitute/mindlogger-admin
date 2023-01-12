import { ManagerData } from 'redux/modules';

export type User = ManagerData & { appletIds: string[] };

export type Actions = {
  removeAccessAction: (user: User) => void;
  editAccessAction: (user: User) => void;
};

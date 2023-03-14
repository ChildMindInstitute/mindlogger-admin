import { ManagerData } from 'redux/modules';

export type User = ManagerData & { appletIds: string[] };

export type ManagersActions = {
  removeAccessAction: (user: User) => void;
  editAccessAction: (user: User) => void;
};

import { Manager } from 'redux/modules';

export type User = Manager & { appletIds: string[]; nickName: string };

export type ManagersActions = {
  removeAccessAction: (user: User) => void;
  editAccessAction: (user: User) => void;
};

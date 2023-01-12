import { ManagerData } from 'redux/modules';

export type Actions = {
  removeAccessAction: (user: ManagerData & { appletIds: string[] }) => void;
  editAccessAction: () => void;
};

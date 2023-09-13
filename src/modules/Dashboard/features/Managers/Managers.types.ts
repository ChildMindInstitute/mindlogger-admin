import { Manager } from 'modules/Dashboard/types';

export type ManagersActions = {
  removeAccessAction: (user: Manager) => void;
  editAccessAction: (user: Manager) => void;
};

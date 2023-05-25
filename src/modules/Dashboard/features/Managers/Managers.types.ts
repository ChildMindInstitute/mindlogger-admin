import { Manager } from 'redux/modules';

export type ManagersActions = {
  removeAccessAction: (user: Manager) => void;
  editAccessAction: (user: Manager) => void;
};

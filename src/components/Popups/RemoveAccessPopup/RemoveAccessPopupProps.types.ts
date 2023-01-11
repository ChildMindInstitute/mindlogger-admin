import { ManagerData } from 'redux/modules';

export type RemoveAccessPopupProps = {
  removeAccessPopupVisible: boolean;
  onClose: () => void;
  user: ManagerData & { appletIds: string[] };
};

export type Steps = 0 | 1 | 2;

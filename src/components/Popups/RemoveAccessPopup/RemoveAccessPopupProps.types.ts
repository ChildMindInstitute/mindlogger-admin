import { ManagerData } from 'redux/modules';

export type RemoveAccessPopupProps = {
  removeAccessPopupVisible: boolean;
  onClose: () => void;
  user: ManagerData & { appletIds: string[] };
};

import { Manager } from 'redux/modules';

export type RemoveAccessPopupProps = {
  removeAccessPopupVisible: boolean;
  onClose: () => void;
  user: Manager & { appletIds: string[] };
};

export type Steps = 0 | 1 | 2;

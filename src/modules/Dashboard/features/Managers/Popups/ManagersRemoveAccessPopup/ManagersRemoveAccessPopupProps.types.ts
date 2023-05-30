import { Manager } from 'redux/modules';

export type RemoveAccessPopupProps = {
  removeAccessPopupVisible: boolean;
  onClose: () => void;
  user: Manager;
  refetchManagers: () => void;
};

export type FormValues = {
  userApplets: { value: boolean; displayName: string; id: string; image?: string }[];
};

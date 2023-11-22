import { Manager } from 'modules/Dashboard/types';

export type RemoveAccessPopupProps = {
  popupVisible: boolean;
  onClose: (step?: number) => void;
  user: Manager;
};

export type FormValues = {
  userApplets: { value: boolean; displayName: string; id: string; image?: string }[];
};

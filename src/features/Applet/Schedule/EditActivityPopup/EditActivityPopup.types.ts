import { Dispatch, SetStateAction } from 'react';

export type EditActivityPopupProps = {
  open: boolean;
  onClose: () => void;
  activityName: string;
  setEditActivityPopupVisible: Dispatch<SetStateAction<boolean>>;
};

import { Dispatch, SetStateAction } from 'react';

export type CreateActivityPopupProps = {
  open: boolean;
  onClose: () => void;
  activityName: string;
  setCreateActivityPopupVisible: Dispatch<SetStateAction<boolean>>;
};

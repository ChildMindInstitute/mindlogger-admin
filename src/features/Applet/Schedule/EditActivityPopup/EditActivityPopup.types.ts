import { Dispatch, SetStateAction } from 'react';

export type EditActivityPopupProps = {
  open: boolean;
  onClose: () => void;
  setRemoveEventPopupVisible: Dispatch<SetStateAction<boolean>>;
};

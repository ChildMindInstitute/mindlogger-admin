import { Dispatch, SetStateAction } from 'react';

export type UnlockAppletPopupProps = {
  appletId: string;
  popupVisible: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
  onSubmitHandler?: () => void;
};

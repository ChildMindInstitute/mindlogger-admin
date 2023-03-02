import { Dispatch, SetStateAction } from 'react';

export type RemoveAppletPopupProps = {
  removeAppletPopupVisible: boolean;
  setRemoveAppletPopupVisible: Dispatch<SetStateAction<boolean>>;
  appletId: string;
  appletName: string;
};

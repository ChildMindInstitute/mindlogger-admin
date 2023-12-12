import { Dispatch, SetStateAction } from 'react';

export type ServerVerifyErrorPopupProps = {
  popupVisible: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
};

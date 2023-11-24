import { Dispatch, SetStateAction } from 'react';

export type WarningPopupProps = {
  popupVisible: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
  submitCallback: () => void;
};

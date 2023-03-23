import { Dispatch, SetStateAction } from 'react';

export type SuccessPopupProps = {
  popupVisible: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
};

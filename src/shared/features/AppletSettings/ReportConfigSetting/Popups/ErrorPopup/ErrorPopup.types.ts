import { Dispatch, SetStateAction } from 'react';

export type ErrorPopupProps = {
  popupVisible: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
  retryCallback: () => void;
};

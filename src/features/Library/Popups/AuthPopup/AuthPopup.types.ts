import { Dispatch, SetStateAction } from 'react';

export type AuthPopupProps = {
  authPopupVisible: boolean;
  setAuthPopupVisible: Dispatch<SetStateAction<boolean>>;
};

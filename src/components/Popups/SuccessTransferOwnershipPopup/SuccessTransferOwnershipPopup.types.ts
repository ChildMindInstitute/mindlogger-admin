import { Dispatch, SetStateAction } from 'react';

export type SuccessTransferOwnershipPopupProps = {
  email: string;
  transferOwnershipPopupVisible: boolean;
  setTransferOwnershipPopupVisible: Dispatch<SetStateAction<boolean>>;
};

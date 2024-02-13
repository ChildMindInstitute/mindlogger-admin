import { Dispatch, SetStateAction } from 'react';

export type TransferOwnershipProps = {
  appletId?: string;
  appletName?: string;
  isSubmitted: boolean;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  setEmailTransferred: Dispatch<SetStateAction<string>>;
  setNoPermissionPopupVisible: Dispatch<SetStateAction<boolean>>;
  'data-testid'?: string;
};

export type TransferOwnershipFormValues = {
  email: string;
};

export type TransferOwnershipRef = {
  resetEmail: () => void;
};

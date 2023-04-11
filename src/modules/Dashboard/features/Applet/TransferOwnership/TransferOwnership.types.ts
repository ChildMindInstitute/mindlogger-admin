import { Dispatch, SetStateAction } from 'react';

export type TransferOwnershipProps = {
  appletId?: string;
  appletName?: string;
  isSubmitted: boolean;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  setEmailTransfered: Dispatch<SetStateAction<string>>;
};

export type TransferOwnershipFormValues = {
  email: string;
};

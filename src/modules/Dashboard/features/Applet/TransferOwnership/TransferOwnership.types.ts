import { Dispatch, SetStateAction } from 'react';

export type TransferOwnershipProps = {
  appletId?: string;
  appletName?: string;
  isSubmitted: boolean;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  setEmailTransferred: Dispatch<SetStateAction<string>>;
  'data-testid'?: string;
};

export type TransferOwnershipFormValues = {
  email: string;
};

export type TransferOwnershipRef = {
  resetEmail: () => void;
};

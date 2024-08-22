import { Dispatch, SetStateAction } from 'react';

import { Encryption } from 'shared/utils/encryption';

export type TransferOwnershipProps = {
  appletId?: string;
  appletName?: string;
  encryption?: Encryption;
  isSubmitted: boolean;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  setEmailTransferred: (email: string) => void;
  'data-testid'?: string;
};

export type TransferOwnershipFormValues = {
  email: string;
};

export type TransferOwnershipRef = {
  resetEmail: () => void;
};

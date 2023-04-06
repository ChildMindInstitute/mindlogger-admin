import { Dispatch, SetStateAction } from 'react';

import { FolderApplet } from 'redux/modules';

export type TransferOwnershipProps = {
  applet?: FolderApplet;
  isSubmitted: boolean;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  setEmailTransfered: Dispatch<SetStateAction<string>>;
};

export type TransferOwnershipFormValues = {
  email: string;
};

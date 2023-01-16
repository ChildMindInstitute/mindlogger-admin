import { Dispatch, SetStateAction } from 'react';

import { Encryption } from 'redux/modules';

export type AppletPasswordRef = {
  submitForm: () => void;
};

export type AppletPasswordForm = { appletPassword: string };

export type AppletPasswordProps = {
  appletId?: string;
  encryption?: Encryption;
  setDisabledSubmit: Dispatch<SetStateAction<boolean>>;
  submitCallback: (encryptionInfo?: any) => void;
};

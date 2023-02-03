import { Encryption } from 'redux/modules';

export type AppletPasswordRef = {
  submitForm: () => void;
};

export type AppletPasswordForm = { appletPassword: string };

export type AppletPasswordProps = {
  appletId?: string;
  encryption?: Encryption;
  submitCallback: (encryptionInfo?: any) => void;
};

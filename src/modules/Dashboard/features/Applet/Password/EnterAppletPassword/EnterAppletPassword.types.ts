import { Encryption } from 'redux/modules';

export type EnterAppletPasswordForm = { appletPassword: string };

export type EnterAppletPasswordProps = {
  appletId?: string;
  encryption?: Encryption;
  submitCallback: (encryptionInfo?: any) => void;
};

import { Encryption } from 'shared/utils';

export type CreateAppletPasswordForm = {
  appletPassword: string;
  appletPasswordConfirmation: string;
};

export type CreateAppletPasswordProps = {
  submitCallback: (encryption: Encryption) => void;
};

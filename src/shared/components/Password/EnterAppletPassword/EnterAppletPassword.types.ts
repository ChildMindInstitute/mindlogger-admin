import { Encryption } from 'shared/utils/encryption';

export type EnterAppletPasswordForm = { appletPassword: string };

export type EnterAppletPasswordProps = {
  appletId: string;
  encryption?: Encryption | null;
  submitCallback: () => void;
  'data-testid'?: string;
};

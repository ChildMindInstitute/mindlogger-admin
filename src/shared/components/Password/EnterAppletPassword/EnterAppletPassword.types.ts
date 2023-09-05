import { Encryption } from 'shared/utils';

export type EnterAppletPasswordForm = { appletPassword: string };

export type EnterAppletPasswordProps = {
  appletId: string;
  encryption?: Encryption | null;
  submitCallback: () => void;
  'data-testid'?: string;
};

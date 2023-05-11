export type EnterAppletPasswordForm = { appletPassword: string };

export type EnterAppletPasswordProps = {
  appletId: string;
  encryption: string;
  submitCallback: () => void;
};

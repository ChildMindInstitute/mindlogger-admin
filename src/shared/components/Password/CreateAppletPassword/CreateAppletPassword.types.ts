export type CreateAppletPasswordForm = {
  appletPassword: string;
  appletPasswordConfirmation: string;
};

export type CreateAppletPasswordProps = {
  submitCallback: () => void;
  'data-testid'?: string;
};

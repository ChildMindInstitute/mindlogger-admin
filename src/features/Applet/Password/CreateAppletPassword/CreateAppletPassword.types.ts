export type AppletPasswordRef = {
  submitForm: () => void;
};

export type AppletPasswordForm = { appletPassword: string; appletPasswordConfirmation: string };

export type AppletPasswordProps = {
  submitCallback: (encryptionInfo?: any) => void;
};

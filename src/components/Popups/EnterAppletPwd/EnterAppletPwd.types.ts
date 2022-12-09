export type AppletPwd = { appletPassword: string };

export type EnterAppletPwdProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: ({ appletPassword }: AppletPwd) => void;
  errorText?: string;
};

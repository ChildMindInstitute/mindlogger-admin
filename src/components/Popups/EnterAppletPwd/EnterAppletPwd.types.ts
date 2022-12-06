export type AppletPwd = { password: string };

export type EnterAppletPwdProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: ({ password }: AppletPwd) => void;
};

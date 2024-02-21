export type NoPermissionPopupProps = {
  open: boolean;
  title: string;
  buttonText?: string;
  onSubmitCallback?: () => void;
  'data-testid': string;
};

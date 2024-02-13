export const enum Modals {
  PasswordCheck = 'passwordCheck',
  Confirmation = 'confirmation',
  DeleteError = 'deleteError',
  NoPermission = 'noPermission',
}

export type DeletePopupProps = {
  onCloseCallback?: () => void;
  'data-testid'?: string;
};

export const enum Modals {
  PasswordCheck = 'passwordCheck',
  DeleteError = 'deleteError',
  NoPermission = 'noPermission',
}

export type DeletePopupProps = {
  onCloseCallback?: () => void;
  'data-testid'?: string;
};

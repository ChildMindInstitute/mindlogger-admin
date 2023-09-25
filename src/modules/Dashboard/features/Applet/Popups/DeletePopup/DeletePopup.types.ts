export const enum Modals {
  PasswordCheck = 'passwordCheck',
  Confirmation = 'confirmation',
  DeleteError = 'deleteError',
}

export type DeletePopupProps = {
  onCloseCallback?: () => void;
  'data-testid'?: string;
};

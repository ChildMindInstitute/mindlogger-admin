export const enum Modals {
  PasswordCheck = 'passwordCheck',
  DeleteError = 'deleteError',
}

export type DeletePopupProps = {
  onCloseCallback?: () => void;
  'data-testid'?: string;
};

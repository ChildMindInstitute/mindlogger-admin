import { Encryption } from 'modules/Dashboard/state';

export const enum Modals {
  PasswordCheck = 'passwordCheck',
  Confirmation = 'confirmation',
  DeleteError = 'deleteError',
}

export type DeletePopupProps = {
  encryption?: Encryption;
};

import { Encryption } from 'modules/Dashboard/state';

export const enum MODALS {
  PasswordCheck = 'passwordCheck',
  Confirmation = 'confirmation',
}

export type DeletePopupProps = {
  encryption?: Encryption;
};

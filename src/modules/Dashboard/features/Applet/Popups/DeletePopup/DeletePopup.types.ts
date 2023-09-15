import { Encryption } from 'shared/utils';

export const enum Modals {
  PasswordCheck = 'passwordCheck',
  Confirmation = 'confirmation',
  DeleteError = 'deleteError',
}

export type DeletePopupProps = {
  onCloseCallback?: () => void;
  'data-testid'?: string;
  testApplet?: { id: string; encryption: Encryption; displayName?: string };
  visibleByDefault?: boolean;
};

import { ReactNode } from 'react';

import { Encryption } from 'shared/utils/encryption';

export type ArbitraryWarningPopupProps = {
  isOpen: boolean;
  onSubmit: () => void;
  onClose: () => void;
  appletId: string;
  appletName: string;
  encryption?: Encryption;
  'data-testid': string;
};

export enum Steps {
  First,
  Second,
}

export type GetScreensProps = {
  enterPasswordScreen: ReactNode;
  appletName: string;
  onFirstCancel: () => void;
  onFirstSubmit: () => void;
  onSecondCancel: () => void;
  onSecondSubmit: () => void;
};

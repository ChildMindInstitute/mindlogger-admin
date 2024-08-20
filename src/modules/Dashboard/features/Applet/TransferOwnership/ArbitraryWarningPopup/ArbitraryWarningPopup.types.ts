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

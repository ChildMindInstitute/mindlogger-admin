import { Encryption } from 'shared/utils';

export enum AppletPasswordPopupType {
  Create = 'create',
  Enter = 'enter',
}

export type AppletPasswordPopupProps = {
  popupType?: AppletPasswordPopupType;
  popupVisible: boolean;
  onClose: () => void;
  appletId: string;
  encryption?: Encryption;
  submitCallback?: (encryption: Encryption) => void;
};

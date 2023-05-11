export enum AppletPasswordPopupType {
  Create = 'create',
  Enter = 'enter',
}

export type AppletPasswordPopupProps = {
  popupType?: AppletPasswordPopupType;
  popupVisible: boolean;
  onClose: () => void;
  appletId: string;
  encryption?: string;
  submitCallback?: (encryption: string) => void;
};

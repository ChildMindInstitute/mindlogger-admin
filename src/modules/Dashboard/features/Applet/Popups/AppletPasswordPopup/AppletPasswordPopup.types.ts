import { Encryption } from 'redux/modules';
import { CreateAppletPasswordForm, EnterAppletPasswordForm } from 'shared/components';

export enum AppletPasswordPopupType {
  Create = 'create',
  Enter = 'enter',
}

export type AppletPasswordPopupProps = {
  popupType?: AppletPasswordPopupType;
  popupVisible: boolean;
  onClose: () => void;
  appletId?: string;
  encryption?: Encryption;
  submitCallback?: (formData: CreateAppletPasswordForm | EnterAppletPasswordForm) => void;
};

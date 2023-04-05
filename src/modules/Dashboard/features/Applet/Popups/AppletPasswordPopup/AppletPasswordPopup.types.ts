import { Encryption } from 'redux/modules';
import { CreateAppletPasswordForm, EnterAppletPasswordForm } from 'modules/Dashboard/features';

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

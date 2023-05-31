import { SingleApplet } from 'shared/state';
import { Encryption } from 'shared/utils';

export type PopupsVisibility =
  | 'deletePopupVisible'
  | 'duplicatePopupsVisible'
  | 'transferOwnershipPopupVisible'
  | 'publishConcealPopupVisible';

export type PopupProps = {
  onSuccess?: () => void;
};

export type PopupsPayload = {
  key: PopupsVisibility;
  value: boolean;
  applet?: SingleApplet;
  encryption?: Encryption | null;
  popupProps?: PopupProps;
};

export type PopupsSchema = {
  data: {
    applet?: SingleApplet;
    encryption?: Encryption | null;
    popupProps?: PopupProps;
    deletePopupVisible: boolean;
    duplicatePopupsVisible: boolean;
    transferOwnershipPopupVisible: boolean;
    publishConcealPopupVisible: boolean;
  };
};

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
  appletId: string;
  encryption?: Encryption | null;
  popupProps?: PopupProps;
};

export type PopupsSchema = {
  data: {
    appletId: string;
    encryption?: Encryption | null;
    popupProps?: PopupProps;
    deletePopupVisible: boolean;
    duplicatePopupsVisible: boolean;
    transferOwnershipPopupVisible: boolean;
    publishConcealPopupVisible: boolean;
  };
};

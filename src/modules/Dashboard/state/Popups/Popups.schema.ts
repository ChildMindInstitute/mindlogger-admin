import { Encryption } from 'shared/utils';

export type PopupsVisibility =
  | 'deletePopupVisible'
  | 'duplicatePopupsVisible'
  | 'transferOwnershipPopupVisible';

export type PopupsPayload = {
  key: PopupsVisibility;
  value: boolean;
  appletId: string;
  encryption?: Encryption | null;
};

export type PopupsSchema = {
  data: {
    appletId: string;
    encryption?: Encryption | null;
    deletePopupVisible: boolean;
    duplicatePopupsVisible: boolean;
    transferOwnershipPopupVisible: boolean;
  };
};

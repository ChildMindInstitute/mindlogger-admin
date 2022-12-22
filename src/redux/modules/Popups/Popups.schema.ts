export type PopupsVisibility =
  | 'deletePopupVisible'
  | 'duplicatePopupsVisible'
  | 'transferOwnershipPopupVisible';

export type PopupsPayload = {
  key: PopupsVisibility;
  value: boolean;
  appletId: string;
};

export type PopupsSchema = {
  data: {
    appletId: string;
    deletePopupVisible: boolean;
    duplicatePopupsVisible: boolean;
    transferOwnershipPopupVisible: boolean;
  };
};

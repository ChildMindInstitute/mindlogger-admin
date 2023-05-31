import { PopupsSchema } from './Popups.schema';

export const state: PopupsSchema = {
  data: {
    applet: undefined,
    encryption: undefined,
    popupProps: undefined,
    deletePopupVisible: false,
    duplicatePopupsVisible: false,
    transferOwnershipPopupVisible: false,
    publishConcealPopupVisible: false,
  },
};

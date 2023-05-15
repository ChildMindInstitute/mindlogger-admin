import { PopupsSchema } from './Popups.schema';

export const state: PopupsSchema = {
  data: {
    appletId: '',
    encryption: undefined,
    deletePopupVisible: false,
    duplicatePopupsVisible: false,
    transferOwnershipPopupVisible: false,
  },
};

import { Manager } from 'modules/Dashboard/types';

export type SelectRespondentsPopupProps = {
  appletName: string;
  appletId: string;
  user: Manager;
  selectedRespondents: string[];
  selectRespondentsPopupVisible: boolean;
  onClose: (selectedRespondents: string[]) => void;
};

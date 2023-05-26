import { Manager } from 'redux/modules';

export type SelectRespondentsPopupProps = {
  appletName: string;
  appletId: string;
  user: Manager;
  selectedRespondents: string[];
  selectRespondentsPopupVisible: boolean;
  onClose: (selectedRespondents: string[]) => void;
};

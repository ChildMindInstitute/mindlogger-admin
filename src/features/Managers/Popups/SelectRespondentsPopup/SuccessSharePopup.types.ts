import { User } from 'features/Managers';

export type SelectRespondentsPopupProps = {
  appletName: string;
  user: User;
  selectedRespondents: string[];
  selectRespondentsPopupVisible: boolean;
  onClose: (selectedRespondents: string[]) => void;
};

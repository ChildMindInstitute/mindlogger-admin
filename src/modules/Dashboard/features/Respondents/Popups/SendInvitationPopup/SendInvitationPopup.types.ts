import { ChosenAppletData } from '../../Respondents.types';

export type SendInvitationPopupProps = {
  popupVisible: boolean;
  onClose: (shouldReFetch: boolean) => void;
  chosenAppletData: ChosenAppletData | null;
  email: string | null;
};

export type SendInvitationForm = {
  email: string;
};

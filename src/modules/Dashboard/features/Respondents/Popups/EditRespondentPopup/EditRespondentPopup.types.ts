import { ChosenAppletData } from '../../Respondents.types';

export type EditRespondentForm = {
  secretUserId: string;
  nickname: string;
};

export type EditRespondentPopupProps = {
  popupVisible: boolean;
  onClose: () => void;
  chosenAppletData: ChosenAppletData | null;
};

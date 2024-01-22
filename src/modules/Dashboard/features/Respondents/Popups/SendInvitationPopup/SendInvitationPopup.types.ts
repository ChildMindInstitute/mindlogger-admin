import { Dispatch, SetStateAction } from 'react';
import { Row } from 'shared/components';

import { ChosenAppletData } from '../../Respondents.types';

export type SendInvitationPopupProps = {
  popupVisible: boolean;
  onClose: (shouldReFetch: boolean) => void;
  tableRows?: Row[];
  chosenAppletData: ChosenAppletData | null;
  setChosenAppletData: Dispatch<SetStateAction<ChosenAppletData | null>>;
  email: string | null;
};

export type SendInvitationForm = {
  email: string;
};

import { Dispatch, SetStateAction } from 'react';

import { ChosenAppletData } from '../../Respondents.types';

export type EditRespondentForm = {
  MRN: string;
  nickName: string;
};

export type EditRespondentPopupProps = {
  popupVisible: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
  chosenAppletData: ChosenAppletData | null;
  setChosenAppletData: Dispatch<SetStateAction<ChosenAppletData | null>>;
};

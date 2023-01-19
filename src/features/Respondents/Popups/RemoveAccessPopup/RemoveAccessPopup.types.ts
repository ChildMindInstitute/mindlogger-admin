import { Dispatch, SetStateAction } from 'react';

import { Row } from 'components';
import { ChosenAppletData } from 'features/Respondents/Respondents.types';

export type RemoveAccessPopupProps = {
  popupVisible: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
  tableRows: Row[] | undefined;
  chosenAppletData: ChosenAppletData | null;
  setChosenAppletData: Dispatch<SetStateAction<ChosenAppletData | null>>;
};

export type Steps = 0 | 1 | 2 | 3 | 4;

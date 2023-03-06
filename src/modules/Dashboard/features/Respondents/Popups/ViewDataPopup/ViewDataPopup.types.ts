import { Dispatch, SetStateAction } from 'react';

import { Row } from 'components';

import { ChosenAppletData } from '../../Respondents.types';

export type ViewDataPopupProps = {
  popupVisible: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
  tableRows: Row[] | undefined;
  chosenAppletData: ChosenAppletData | null;
  setChosenAppletData: Dispatch<SetStateAction<ChosenAppletData | null>>;
};

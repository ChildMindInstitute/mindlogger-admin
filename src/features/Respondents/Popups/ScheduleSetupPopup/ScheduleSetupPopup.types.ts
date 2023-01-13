import { Dispatch, SetStateAction } from 'react';

import { Row } from 'components';
import { ChosenAppletData } from 'features/Respondents/Respondents.types';

export type ScheduleSetupPopupProps = {
  popupVisible: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
  tableRows: Row[] | undefined;
  chosenAppletData: ChosenAppletData | null;
  setChosenAppletData: Dispatch<SetStateAction<ChosenAppletData | null>>;
};

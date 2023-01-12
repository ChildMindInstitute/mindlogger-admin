import { Dispatch, SetStateAction } from 'react';

import { Row } from 'components/Tables';
import { ChosenAppletData } from 'components/Tables/RespondentsTable';

export type ScheduleSetupPopupProps = {
  popupVisible: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
  tableRows: Row[] | undefined;
  chosenAppletData: ChosenAppletData | null;
  setChosenAppletData: Dispatch<SetStateAction<ChosenAppletData | null>>;
};

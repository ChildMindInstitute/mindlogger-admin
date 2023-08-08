import { Dispatch, SetStateAction } from 'react';

import { Row } from 'shared/components';
import { SingleApplet } from 'shared/state';

import { ChosenAppletData } from '../../Respondents.types';

export type DataExportPopupProps = {
  popupVisible: boolean;
  isAppletSetting?: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
  tableRows?: Row[];
  chosenAppletData: ChosenAppletData | SingleApplet | null;
  setChosenAppletData?: Dispatch<SetStateAction<ChosenAppletData | null>>;
};

export const enum Modals {
  DataExport = 'dataExport',
  ExportError = 'exportError',
  PasswordCheck = 'passwordCheck',
}

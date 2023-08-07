import { Dispatch, SetStateAction } from 'react';

import { Row } from 'shared/components';

import { ChosenAppletData } from '../../Respondents.types';

export type DataExportPopupProps = {
  popupVisible: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
  tableRows: Row[] | undefined;
  chosenAppletData: ChosenAppletData | null;
  setChosenAppletData: Dispatch<SetStateAction<ChosenAppletData | null>>;
};

export const enum Modals {
  DataExport = 'dataExport',
  ExportError = 'exportError',
  PasswordCheck = 'passwordCheck',
}

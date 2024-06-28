import { Dispatch, SetStateAction } from 'react';

import { Row } from 'shared/components';
import { SingleApplet } from 'shared/state';
import { ExportDataFilters } from 'shared/utils';
import { ExportDateType } from 'shared/features/AppletSettings/ExportDataSetting/ExportDataSetting.types';

import { ChosenAppletData } from '../../Respondents.types';

export type DataExportPopupProps = {
  filters?: ExportDataFilters;
  popupVisible: boolean;
  isAppletSetting?: boolean;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
  tableRows?: Row[];
  chosenAppletData: ChosenAppletData | SingleApplet | null;
  setChosenAppletData?: Dispatch<SetStateAction<ChosenAppletData | null>>;
  'data-testid'?: string;
};

export const enum Modals {
  DataExport = 'dataExport',
  ExportError = 'exportError',
  PasswordCheck = 'passwordCheck',
}

export type ExecuteAllPagesOfExportData = {
  appletId: string;
  targetSubjectIds?: string;
};

export type GetFormattedToDate = {
  dateType?: ExportDateType;
  formToDate?: Date;
};

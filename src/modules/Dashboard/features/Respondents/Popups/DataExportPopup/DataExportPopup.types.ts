import { Dispatch, MutableRefObject, SetStateAction } from 'react';

import { Row } from 'shared/components';
import { SingleApplet } from 'shared/state';
import { Encryption, ExportDataFilters } from 'shared/utils';
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

export type ExportDataProps = ExecuteAllPagesOfExportData & {
  fromDate: string;
  toDate?: string;
  page?: number;
};

export type GetFormattedToDate = {
  dateType?: ExportDateType;
  formToDate?: Date;
};

export type IdleWorker = Worker & {
  isIdle: boolean;
};

export type MultipleDecryptWorkersProps = {
  handleExportPopupClose: () => void;
  appletId: string;
  privateKeyRef: MutableRefObject<number[] | null>;
  encryption?: Encryption | null;
  filters?: ExportDataFilters;
};

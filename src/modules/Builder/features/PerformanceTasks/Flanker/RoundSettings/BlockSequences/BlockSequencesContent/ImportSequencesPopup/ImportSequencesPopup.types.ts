import { Dispatch, SetStateAction } from 'react';

import { UploadedTable } from '../BlockSequencesContent.types';

export enum ImportSequencesType {
  Upload,
  Update,
}

export type SetUploadedTable = Dispatch<SetStateAction<UploadedTable>>;

export type ImportSequencesPopupProps = {
  open: boolean;
  onClose: () => void;
  onDownloadCsv: () => void;
  onDownloadXlsx: () => void;
  uiType: ImportSequencesType;
  imageNames: string[];
  setUploadedTable: SetUploadedTable;
};

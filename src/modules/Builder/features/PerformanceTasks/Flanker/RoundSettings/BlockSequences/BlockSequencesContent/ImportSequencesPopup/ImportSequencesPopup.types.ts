import { SetUploadedTable } from '../BlockSequencesContent.types';

export enum ImportSequencesType {
  Upload,
  Update,
}

export type ImportSequencesPopupProps = {
  open: boolean;
  onClose: () => void;
  onDownloadCsv: () => void;
  onDownloadXlsx: () => void;
  uiType: ImportSequencesType;
  uploadedImages: string[];
  setUploadedTable: SetUploadedTable;
};

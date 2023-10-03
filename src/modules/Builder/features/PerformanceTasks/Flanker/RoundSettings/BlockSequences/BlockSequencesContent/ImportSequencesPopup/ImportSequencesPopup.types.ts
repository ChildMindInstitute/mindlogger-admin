import { SetUploadedTable } from '../BlockSequencesContent.types';

export enum ImportSequencesType {
  Upload,
  Update,
}

export type UploadedImages = Record<string, string>;

export type ImportSequencesPopupProps = {
  open: boolean;
  onClose: () => void;
  onDownloadCsv: () => void;
  onDownloadXlsx: () => void;
  uiType: ImportSequencesType;
  uploadedImages: UploadedImages;
  setUploadedTable: SetUploadedTable;
};

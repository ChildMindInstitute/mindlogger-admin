import { Dispatch, SetStateAction } from 'react';

export enum FileUploaderUiType {
  Primary,
  Secondary,
}

export type ImportedFile = {
  name: string;
  data: Record<string, string | number>[];
};

export type FileUploaderProps = {
  uploadLabel: string | JSX.Element;
  onFileReady: (file: ImportedFile | null) => void;
  invalidFileFormatError: JSX.Element;
  onDownloadTemplate?: () => void;
  onDownloadSecond?: () => void;
  downloadFirstText?: string;
  downloadSecondText?: string;
  validationError?: JSX.Element | string | null;
  uiType?: FileUploaderUiType;
};

export type FileUploaderRefProps = {
  setFile: Dispatch<SetStateAction<null | ImportedFile>>;
};

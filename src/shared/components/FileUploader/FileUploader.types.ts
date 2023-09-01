export enum FileUploaderUiType {
  Primary,
  Secondary,
}

export type ImportedFile = {
  name: string;
  data: Record<string, string | number>[];
};

export const enum FileError {
  SchemaValidation = 'schema-validation',
}

export type FileUploaderProps = {
  uploadLabel: string | JSX.Element;
  onFileReady: (file: ImportedFile | null) => void | FileError;
  invalidFileFormatError: JSX.Element;
  onDownloadTemplate?: () => void;
  onDownloadSecond?: () => void;
  downloadFirstText?: string;
  downloadSecondText?: string;
  validationError?: JSX.Element | string | null;
  parsingError?: JSX.Element | string | null;
  uiType?: FileUploaderUiType;
  csvOnly?: boolean;
};

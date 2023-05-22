export type ImportedFile = {
  name: string;
  data: Record<string, string | number>[];
};

export type FileUploaderProps = {
  uploadLabel: string | JSX.Element;
  onFileReady: (file: ImportedFile | null) => void;
  invalidFileFormatError: JSX.Element;
  onDownloadTemplate?: () => void;
  validationError?: JSX.Element | null;
};

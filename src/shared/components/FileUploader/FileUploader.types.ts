export type ImportedFile = {
  name: string;
  data: Record<string, string | number>[];
};

export type FileUploaderProps = {
  uploadLabel: JSX.Element;
  onFileReady: (file: ImportedFile | null) => void;
  onDownloadTemplate?: () => void;
  invalidFileFormatError: JSX.Element;
};

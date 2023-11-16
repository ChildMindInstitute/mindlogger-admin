export type MediaType = {
  url?: string | MediaStream;
  name?: string;
  uploaded?: boolean;
};

export type MediaUploaderProps = {
  width: number;
  height: number;
  media: MediaType | null;
  placeholder?: JSX.Element | string;
  hasPreview?: boolean;
  onUpload: (media: MediaType | null) => void;
  'data-testid'?: string;
};

export type MediaUploaderHookProps = {
  onUpload: (media: MediaType | null) => void;
};

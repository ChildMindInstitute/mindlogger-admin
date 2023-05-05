import { Dispatch, SetStateAction } from 'react';

export type MediaType = {
  url?: string;
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
};

export type MediaUploaderHookProps = {
  onUpload: (media: MediaType | null) => void;
};

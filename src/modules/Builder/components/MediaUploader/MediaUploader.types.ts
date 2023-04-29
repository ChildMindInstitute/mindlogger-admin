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
  onUpload: Dispatch<SetStateAction<MediaType | null>>;
};

export type MediaUploaderHookProps = {
  media: MediaType | null;
  onUpload: Dispatch<SetStateAction<MediaType | null>>;
};

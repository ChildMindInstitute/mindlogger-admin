import { Dispatch, SetStateAction } from 'react';
import { InsertContentGenerator } from 'md-editor-rt';

import { MediaType } from 'shared/consts';

import { SourceLinkModalForm } from '../SourceLinkModal';

export type InsertContentExtensionProps = {
  onInsert: (generator: InsertContentGenerator) => void;
};

type MediaProps = {
  fileSizeExceeded: number;
  setFileSizeExceeded: Dispatch<SetStateAction<number | null>>;
  setIncorrectFormat: Dispatch<SetStateAction<MediaType | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export type MediaContentExtensionProps = InsertContentExtensionProps & MediaProps;

export type UploadMethodsProps = {
  insertHandler: (data: SourceLinkModalForm) => void;
  type: MediaType;
} & MediaProps;

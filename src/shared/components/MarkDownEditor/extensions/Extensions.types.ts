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
};

export type MediaContentExtensionProps = InsertContentExtensionProps &
  MediaProps & {
    setIncorrectFormat: Dispatch<SetStateAction<MediaType | null>>;
  };

export type UploadMethodsProps = {
  insertHandler: (data: SourceLinkModalForm) => void;
  type: MediaType;
  setIncorrectFormat: Dispatch<SetStateAction<MediaType | null>>;
} & MediaProps;

import { Dispatch, SetStateAction } from 'react';
import { InsertContentGenerator } from 'md-editor-rt';

import { SourceLinkModalForm } from '../SourceLinkModal';

export type InsertContentExtensionProps = {
  onInsert: (generator: InsertContentGenerator) => void;
};

type MediaProps = {
  fileSizeExceeded: number;
  setFileSizeExceeded: Dispatch<SetStateAction<number | null>>;
};

export type MediaContentExtensionProps = InsertContentExtensionProps & MediaProps;

export type ImageUploadExtensionProps = MediaContentExtensionProps & {
  setIncorrectImageFormat: Dispatch<SetStateAction<boolean>>;
};

export type UploadMethodsProps = {
  insertHandler: (data: SourceLinkModalForm) => void;
  setIncorrectImageFormat?: Dispatch<SetStateAction<boolean>>;
} & MediaProps;

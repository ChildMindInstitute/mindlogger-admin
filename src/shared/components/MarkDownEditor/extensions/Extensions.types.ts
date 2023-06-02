import { InsertContentGenerator } from 'md-editor-rt';
import { SourceLinkModalForm } from '../SourceLinkModal';

export type InsertContentExtensionProps = {
  onInsert: (generator: InsertContentGenerator) => void;
};

export type UploadMethodsProps = {
  insertHandler: (data: SourceLinkModalForm) => void;
};

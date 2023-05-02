import { InsertContentGenerator } from 'md-editor-rt';
import { SourceLinkModalForm } from '../SourceLinkModal';

export type InsertContentExtensionProps = {
  onInsert: (generator: InsertContentGenerator) => void;
};

export type InsertHandlerProps = { values?: SourceLinkModalForm; imgLink?: string };

export type UploadMethodsProps = {
  insertHandler: ({ values, imgLink }: InsertHandlerProps) => void;
};

import { InsertContentGenerator } from 'md-editor-rt';

export type InsertContentExtensionProps = {
  onInsert: (generator: InsertContentGenerator) => void;
};

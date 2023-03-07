import { InsertContentGenerator } from 'md-editor-rt';

export type MarkExtensionProp = {
  onInsert: (generator: InsertContentGenerator) => void;
};

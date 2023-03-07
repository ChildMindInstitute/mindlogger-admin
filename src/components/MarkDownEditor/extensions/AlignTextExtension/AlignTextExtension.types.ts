import { InsertContentGenerator } from 'md-editor-rt';

export type AlignTextExtensionProps = {
  onInsert: (generator: InsertContentGenerator) => void;
  type: 'left' | 'center' | 'right';
  title: string;
};

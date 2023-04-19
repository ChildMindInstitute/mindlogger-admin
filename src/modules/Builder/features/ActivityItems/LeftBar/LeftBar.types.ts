import { ItemFormValues } from 'modules/Builder/pages/BuilderApplet';

export type LeftBarProps = {
  items: ItemFormValues[];
  activeItemId: string;
  onSetActiveItem: (id: string) => void;
  onAddItem: () => void;
  onInsertItem: (index: number) => void;
  onDuplicateItem: (index: number) => void;
  onRemoveItem: (id: string) => void;
  onMoveItem: (indexA: number, indexB: number) => void;
};

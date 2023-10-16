import { ItemFormValues } from 'modules/Builder/types';

export type LeftBarProps = {
  activeItemIndex: number;
  onSetActiveItem: (item: ItemFormValues) => void;
  onAddItem: () => void;
  onInsertItem: (index: number) => void;
  onDuplicateItem: (index: number) => void;
  onRemoveItem: (id: string) => void;
  onMoveItem: (indexA: number, indexB: number) => void;
};

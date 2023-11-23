export type DraggableItemProps = {
  itemName: string;
  index: number;
  itemId: string;
  isInsertVisible: boolean;
  onSetActiveItem: () => void;
  onDuplicateItem: () => void;
  onRemoveItem: () => void;
  onInsertItem: (index: number) => void;
  onChangeItemVisibility: () => void;
  'data-testid'?: string;
};

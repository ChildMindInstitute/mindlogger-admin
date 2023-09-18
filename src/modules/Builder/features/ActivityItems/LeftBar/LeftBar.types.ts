export type LeftBarProps = {
  activeItemIndex: number;
  onSetActiveItem: (id: string) => void;
  onAddItem: () => void;
  onInsertItem: (index: number) => void;
  onDuplicateItem: (index: number) => void;
  onRemoveItem: (id: string) => void;
  onMoveItem: (indexA: number, indexB: number) => void;
};

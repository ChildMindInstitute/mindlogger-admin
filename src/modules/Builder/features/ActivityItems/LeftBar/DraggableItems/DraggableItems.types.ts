import { DroppableProvided } from 'react-beautiful-dnd';

import { ItemFormValues } from 'modules/Builder/types';

export type DraggableItemsProps = {
  items: ItemFormValues[];
  listProvided: DroppableProvided;
  isDragging: boolean;
  onSetActiveItem: (item: ItemFormValues) => void;
  onDuplicateItem: (index: number) => void;
  onRemoveItem: (id: string) => void;
  onInsertItem: (index: number) => void;
  onChangeItemVisibility: (itemName: string) => void;
};

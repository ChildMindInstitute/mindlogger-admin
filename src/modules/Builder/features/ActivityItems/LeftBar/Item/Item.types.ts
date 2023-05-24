import { DraggableProvided } from 'react-beautiful-dnd';

import { ItemFormValues } from 'modules/Builder/pages/BuilderApplet';

import { LeftBarProps } from '../LeftBar.types';

export type ItemProps = {
  item: ItemFormValues;
  name: string;
  index: number;
  dragHandleProps: DraggableProvided['dragHandleProps'];
  isDragging: boolean;
} & Omit<LeftBarProps, 'items' | 'onAddItem' | 'onInsertItem' | 'onMoveItem'>;

export type ActionsType = {
  onRemoveItem: LeftBarProps['onRemoveItem'];
  onDuplicateItem: () => void;
  onChangeVisibility: () => void;
  isItemHidden: boolean;
  hasHiddenOption: boolean;
};

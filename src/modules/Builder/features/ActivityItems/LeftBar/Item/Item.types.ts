import { DraggableProvided } from 'react-beautiful-dnd';

import { ItemFormValues } from 'modules/Builder/types';

import { LeftBarProps } from '../LeftBar.types';

export type ItemProps = {
  item: ItemFormValues;
  name?: string;
  index?: number;
  dragHandleProps?: DraggableProvided['dragHandleProps'];
  isDragging?: boolean;
  activeItemId: string;
  onSetActiveItem: (id: string) => void;
} & Omit<
  LeftBarProps,
  'items' | 'onAddItem' | 'onInsertItem' | 'onMoveItem' | 'activeItemIndex' | 'onSetActiveItemIndex'
>;

export type ActionsType = {
  onRemoveItem: LeftBarProps['onRemoveItem'];
  onDuplicateItem: () => void;
  onChangeVisibility: () => void;
  isItemHidden: boolean;
  hasHiddenOption: boolean;
  'data-testid'?: string;
};

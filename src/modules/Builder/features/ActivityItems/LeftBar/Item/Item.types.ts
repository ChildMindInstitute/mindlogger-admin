import { DraggableProvided } from 'react-beautiful-dnd';

import { ItemFormValues } from 'modules/Builder/types';

import { LeftBarProps } from '../LeftBar.types';

export type ItemProps = {
  name?: string;
  index: number;
  dragHandleProps?: DraggableProvided['dragHandleProps'];
  isDragging?: boolean;
  onSetActiveItem: (item: ItemFormValues) => void;
  onDuplicateItem: () => void;
  onChangeItemVisibility?: () => void;
  onRemoveItem: (id: string) => void;
  'data-testid': string;
};

export type ActionsType = {
  onRemoveItem: LeftBarProps['onRemoveItem'];
  onDuplicateItem: () => void;
  onChangeVisibility: () => void;
  isItemHidden?: boolean;
  hasHiddenOption: boolean;
  'data-testid'?: string;
};

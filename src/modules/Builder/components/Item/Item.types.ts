import { MouseEvent } from 'react';

import { DraggableProvided } from 'react-beautiful-dnd';

export type ItemType = {
  id?: string;
  name: string;
  description: string;
  img?: string;
  count?: number;
  index?: number;
  total?: number;
};

type Action = {
  icon: JSX.Element;
  action: (item?: ItemType, event?: MouseEvent<HTMLElement>) => void;
  toolTipTitle?: string;
};

export enum ItemUiType {
  Activity,
  Flow,
  FlowBuilder,
}

export type ItemProps = {
  getActions: (key?: string) => Action[];
  isInactive?: boolean;
  hasError?: boolean;
  visibleByDefault?: boolean;
  hasStaticActions?: boolean;
  uiType?: ItemUiType;
  onItemClick?: () => void;
  dragHandleProps?: DraggableProvided['dragHandleProps'];
  isDragging?: boolean;
  'data-testid'?: string;
} & ItemType;

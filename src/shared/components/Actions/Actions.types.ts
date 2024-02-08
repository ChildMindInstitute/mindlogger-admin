import { MouseEvent } from 'react';

import { SxProps } from '@mui/material';
import { DraggableProvided } from 'react-beautiful-dnd';

export type Action<T> = {
  icon: JSX.Element;
  action: (context: ActionsProps<T>['context'], event?: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  tooltipTitle?: string;
  isDisplayed?: boolean;
  active?: boolean;
  isStatic?: boolean;
  'data-testid'?: string;
};

export type ActionsProps<T> = {
  items: Action<T>[];
  context: T;
  visibleByDefault?: boolean;
  hasStaticActions?: boolean;
  sxProps?: SxProps;
  dragHandleProps?: DraggableProvided['dragHandleProps'];
  isDragging?: boolean;
  'data-testid'?: string;
};

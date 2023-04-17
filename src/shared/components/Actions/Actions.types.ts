import { MouseEvent } from 'react';
import { SxProps } from '@mui/material';
import { DraggableProvided } from 'react-beautiful-dnd';

export type Action = {
  icon: JSX.Element;
  action: (item?: any, event?: MouseEvent<HTMLElement>) => any | void;
  disabled?: boolean;
  tooltipTitle?: string;
  isDisplayed?: boolean;
  active?: boolean;
  isStatic?: boolean;
};

export type ActionsProps = {
  items: Action[];
  context: unknown;
  visibleByDefault?: boolean;
  hasStaticActions?: boolean;
  sxProps?: SxProps;
  dragHandleProps?: DraggableProvided['dragHandleProps'];
  isDragging?: boolean;
};

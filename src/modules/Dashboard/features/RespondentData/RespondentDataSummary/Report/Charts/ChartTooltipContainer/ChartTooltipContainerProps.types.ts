import { MouseEventHandler, ReactNode } from 'react';

export type ChartTooltipContainerProps = {
  onMouseEnter: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
  'data-testid'?: string;
  children?: ReactNode;
};

import { MouseEventHandler } from 'react';

export type ScatterTooltipRowData = {
  x: Date;
  y: Date;
};

export type ChartTooltipProps = {
  data: ScatterTooltipRowData[] | null;
  onMouseEnter: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
};

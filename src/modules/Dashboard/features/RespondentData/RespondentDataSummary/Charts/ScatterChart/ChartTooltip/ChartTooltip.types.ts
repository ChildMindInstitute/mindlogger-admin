import { MouseEventHandler } from 'react';
import { TooltipItem } from 'chart.js';

export type ChartTooltipProps = {
  data: TooltipItem<'scatter'> | null;
  onMouseEnter: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
};

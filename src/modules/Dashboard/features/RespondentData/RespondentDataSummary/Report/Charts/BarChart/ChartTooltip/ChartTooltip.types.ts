import { MouseEventHandler } from 'react';

import { TooltipData } from '../BarChart.types';

export type ChartTooltipProps = {
  data: TooltipData | null;
  onMouseEnter: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
};

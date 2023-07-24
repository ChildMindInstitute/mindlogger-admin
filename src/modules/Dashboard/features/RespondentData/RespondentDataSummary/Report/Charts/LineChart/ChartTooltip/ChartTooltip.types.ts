import { MouseEventHandler } from 'react';

import { TooltipData } from '../LineChart.types';

export type ChartTooltipProps = {
  dataPoints: TooltipData[] | null;
  onMouseEnter: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
};

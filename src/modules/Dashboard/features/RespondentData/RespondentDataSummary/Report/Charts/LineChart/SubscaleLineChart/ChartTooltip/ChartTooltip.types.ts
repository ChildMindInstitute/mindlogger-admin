import { MouseEventHandler } from 'react';

import { TooltipData } from '..';

export type ChartTooltipProps = {
  dataPoints: TooltipData[] | null;
  onMouseEnter: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
};

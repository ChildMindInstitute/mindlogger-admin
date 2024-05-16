import { TooltipItem } from 'chart.js';

import { ReviewCount } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type ChartTooltipProps = {
  data: TooltipItem<'scatter'> | null;
  'data-testid'?: string;
};

export type ScatterTooltipRowData = {
  x: string;
  y: number;
  id: string;
  areSubscalesVisible: boolean;
  isFlow: boolean;
  reviewCount?: ReviewCount;
};

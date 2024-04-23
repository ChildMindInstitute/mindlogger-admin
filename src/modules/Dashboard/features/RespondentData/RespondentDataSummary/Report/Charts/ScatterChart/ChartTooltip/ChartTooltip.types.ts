import { TooltipItem } from 'chart.js';

import { ReviewCount } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type ChartTooltipProps = {
  data: TooltipItem<'scatter'> | null;
  'data-testid'?: string;
};

export type ScatterTooltipRowData = {
  x: string;
  y: number;
  answerId: string;
  areSubscalesVisible: boolean;
  reviewCount?: ReviewCount;
};

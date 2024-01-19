import { TooltipItem } from 'chart.js';

export type ChartTooltipProps = {
  data: TooltipItem<'scatter'> | null;
  'data-testid'?: string;
};

export type ScatterTooltipRowData = {
  x: string;
  y: number;
  answerId: string;
  areSubscalesVisible: boolean;
};

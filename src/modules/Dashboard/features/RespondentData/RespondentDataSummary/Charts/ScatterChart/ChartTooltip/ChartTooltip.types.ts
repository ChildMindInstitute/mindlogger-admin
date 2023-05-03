import { TooltipItem } from 'chart.js';

export type ChartTooltipPosition = {
  top: string;
  left: string;
};

export type ChartTooltipProps = {
  position: ChartTooltipPosition;
  data: TooltipItem<'scatter'>;
};

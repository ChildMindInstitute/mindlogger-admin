export type ScatterTooltipRowData = {
  x: Date;
  y: Date;
};

export type ChartTooltipProps = {
  data: ScatterTooltipRowData[] | null;
  'data-testid'?: string;
};

import { Chart, ChartDataset, ChartTypeRegistry, LegendElement } from 'chart.js';

export type Response = {
  date: Date;
  score: number;
};

export type Subscale = {
  id: string;
  name: string;
  responses: Response[];
};

export type Version = {
  date: Date;
  version: string;
};

export type SubscaleChartData = {
  subscales: Subscale[];
  versions: Version[];
};

export type CustomLegend = LegendElement<keyof ChartTypeRegistry> & {
  fit: () => void;
};

export type ExtendedChartDataset = ChartDataset & {
  labels: string[];
};

export type Tick = { index: number; chart: Chart };

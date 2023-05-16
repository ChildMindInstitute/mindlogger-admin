import { ChartDataset } from 'chart.js';

export type ResponseOption = {
  id: string;
  option: string;
};

export type Responses = {
  id: string;
  dates: Date[] | string[];
};

export type Version = {
  date: Date | string;
  version: string;
};

export type Data = {
  responseOptions: ResponseOption[];
  responses: Responses[];
  versions: Version[];
};

export type ExtendedChartDataset = ChartDataset & {
  labels: string[];
};

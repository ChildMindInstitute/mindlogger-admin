import { ChartTypeRegistry, LegendElement } from 'chart.js';

export type CustomLegend = LegendElement<keyof ChartTypeRegistry> & {
  fit: () => void;
};

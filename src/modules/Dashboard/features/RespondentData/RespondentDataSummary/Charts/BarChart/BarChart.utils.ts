import { ChartData } from './BarChart.types';
import { BORDER_RADIUS, COLORS } from './BarChart.const';

export const getDatasets = (chartData: ChartData[]) =>
  chartData.map((item, index) => ({
    label: item.label,
    data: [item.score],
    backgroundColor: COLORS[index % COLORS.length],
    borderRadius: BORDER_RADIUS,
    maxBarThickness: 64,
    categoryPercentage: 0.35,
  }));

import { SubscaleChartData } from './BarChart.types';
import { BORDER_RADIUS, COLORS } from './BarChart.const';

export const getDatasets = (chartData: SubscaleChartData) =>
  chartData.map((item, index) => ({
    label: item.label,
    data: [item.score],
    backgroundColor: COLORS[index % COLORS.length],
    borderRadius: BORDER_RADIUS,
    maxBarThickness: 64,
    categoryPercentage: 0.35,
  }));

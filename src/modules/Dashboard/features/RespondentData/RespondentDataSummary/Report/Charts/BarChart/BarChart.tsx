import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { getDatasets, getOptions } from './BarChart.utils';
import { BarChartProps, CustomLegend } from './BarChart.types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const BarChart = ({ chartData }: BarChartProps) => {
  const legendMargin = {
    id: 'legendMargin',
    beforeInit: (chart: ChartJS) => {
      const originalFit = (chart.legend as CustomLegend).fit;
      (chart.legend as CustomLegend).fit = function fit() {
        originalFit.bind(chart.legend)();
        this.height += 42;
      };
    },
  };

  const data = {
    labels: [''],
    datasets: getDatasets(chartData),
  };

  return <Bar plugins={[legendMargin]} options={getOptions(chartData)} data={data} />;
};

import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Tooltip,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';

import { getOptions, getData } from './LineChart.utils';
import { CustomLegend, LineChartProps } from './LineChart.types';
import { locales } from '../Charts.const';

ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Tooltip, TimeScale);

export const LineChart = ({ data }: LineChartProps) => {
  const { i18n } = useTranslation('app');

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

  return (
    <Line
      options={getOptions(i18n.language as keyof typeof locales, data)}
      data={getData(data)}
      plugins={[ChartDataLabels, legendMargin]}
    />
  );
};

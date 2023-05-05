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

import { mockedSubscales } from './mock';
import { getOptions, getData, locales } from './LineChart.utils';
import { CustomLegend } from './LineChart.types';

ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Tooltip, TimeScale);

export const LineChart = () => {
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
      options={getOptions(i18n.language as keyof typeof locales, mockedSubscales)}
      data={getData(mockedSubscales)}
      plugins={[ChartDataLabels, legendMargin]}
    />
  );
};

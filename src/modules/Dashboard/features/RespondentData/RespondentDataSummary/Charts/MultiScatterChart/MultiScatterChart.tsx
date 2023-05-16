import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  TimeScale,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

import { locales } from 'shared/consts';

import { mocks as responses } from './mock';
import { getOptions, getData } from './MultiScatterChart.utils';

export const MultiScatterChart = () => {
  const chartRef = useRef<ChartJSOrUndefined<'scatter', { x: Date; y: number }[], unknown> | null>(
    null,
  );
  const { i18n } = useTranslation('app');

  ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, TimeScale);

  const renderChart = useMemo(
    () => (
      <Scatter
        ref={chartRef}
        options={getOptions(i18n.language as keyof typeof locales, responses)}
        data={getData(responses)}
        plugins={[ChartDataLabels]}
      />
    ),
    [chartRef],
  );

  return renderChart;
};

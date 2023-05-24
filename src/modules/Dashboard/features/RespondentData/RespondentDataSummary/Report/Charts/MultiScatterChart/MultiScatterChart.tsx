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

import { getOptions, getData } from './MultiScatterChart.utils';
import { MultiScatterChartProps } from './MultiScatterChart.types';

export const MultiScatterChart = ({
  minDate,
  maxDate,
  minY = 1,
  maxY,
  height,
  responseValues,
  responseType,
  answers,
  versions,
}: MultiScatterChartProps) => {
  const chartRef = useRef<ChartJSOrUndefined<'scatter', { x: Date; y: number }[], unknown> | null>(
    null,
  );
  const { i18n } = useTranslation('app');

  ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, TimeScale);

  const lang = i18n.language as keyof typeof locales;

  const renderChart = useMemo(
    () => (
      <Scatter
        height={height}
        ref={chartRef}
        options={getOptions({ lang, minY, maxY, minDate, maxDate, responseValues, responseType })}
        data={getData({ maxY, responseValues, responseType, answers, versions })}
        plugins={[ChartDataLabels]}
      />
    ),
    [chartRef, minDate, maxDate, versions, responseValues, lang],
  );

  return renderChart;
};

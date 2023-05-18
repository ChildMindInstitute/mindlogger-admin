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

import { getOptions, getData, formatAnswers } from './MultiScatterChart.utils';
import { TICK_HEIGHT } from './MultiScatterChart.const';
import { MultiScatterChartProps } from './MultiScatterChart.types';

export const MultiScatterChart = ({
  minDate,
  maxDate,
  responseValues,
  answers,
  versions,
}: MultiScatterChartProps) => {
  const chartRef = useRef<ChartJSOrUndefined<'scatter', { x: Date; y: number }[], unknown> | null>(
    null,
  );
  const { i18n } = useTranslation('app');

  ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, TimeScale);

  const height = responseValues.options.length * TICK_HEIGHT;
  const lang = i18n.language as keyof typeof locales;

  const formattedAnswers = formatAnswers(answers);

  const renderChart = useMemo(
    () => (
      <Scatter
        height={height}
        ref={chartRef}
        options={getOptions(lang, responseValues, minDate, maxDate)}
        data={getData(responseValues, formattedAnswers, versions)}
        plugins={[ChartDataLabels]}
      />
    ),
    [chartRef, minDate, maxDate, versions, responseValues, lang],
  );

  return renderChart;
};

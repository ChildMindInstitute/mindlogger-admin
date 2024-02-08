import { useMemo, useRef, useState } from 'react';

import { Box } from '@mui/material';
import {
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  ScriptableTooltipContext,
  TimeScale,
  Tooltip,
  TooltipItem,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Scatter } from 'react-chartjs-2';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { useTranslation } from 'react-i18next';

import { locales } from 'shared/consts';

import { ChartType, SetTooltipData } from '../Chart.types';
import { scatterChartTooltipHandler } from '../Charts.utils';
import { ChartTooltipContainer } from '../ChartTooltipContainer';
import { ChartTooltip } from './ChartTooltip';
import { MultiScatterChartProps } from './MultiScatterChart.types';
import { getData, getOptions } from './MultiScatterChart.utils';

export const MultiScatterChart = ({
  color,
  minDate,
  maxDate,
  minY,
  maxY,
  height,
  responseValues,
  responseType,
  answers,
  versions,
  'data-testid': dataTestid,
}: MultiScatterChartProps) => {
  const { i18n } = useTranslation('app');
  const chartRef = useRef<ChartJSOrUndefined<'scatter', { x: Date; y: number }[], unknown> | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const isHovered = useRef(false);

  const [tooltipData, setTooltipData] = useState<TooltipItem<'scatter'>[] | null>(null);

  ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, TimeScale);

  const lang = i18n.language as keyof typeof locales;

  const hideTooltip = () => {
    const tooltipEl = tooltipRef.current;

    if (!tooltipEl) return;

    isHovered.current = false;
    tooltipEl.style.display = 'none';
  };

  const tooltipHandler = (context: ScriptableTooltipContext<'scatter'>) =>
    scatterChartTooltipHandler({
      context,
      tooltipRef,
      isHovered,
      chartRef,
      setTooltipData: setTooltipData as SetTooltipData,
      chartType: ChartType.MultiScatterChart,
    });

  const renderChart = useMemo(
    () => (
      <Scatter
        ref={chartRef}
        options={getOptions({
          lang,
          minY,
          maxY,
          minDate,
          maxDate,
          responseValues,
          responseType,
          tooltipHandler,
        })}
        data={getData({ maxY, answers, versions, color })}
        plugins={[ChartDataLabels]}
      />
    ),
    [answers, lang],
  );

  return (
    <Box sx={{ height, position: 'relative' }} data-testid={dataTestid}>
      {renderChart}
      <ChartTooltipContainer
        ref={tooltipRef}
        onMouseEnter={() => {
          isHovered.current = true;
        }}
        onMouseLeave={hideTooltip}
        data-testid={dataTestid}>
        <ChartTooltip data={tooltipData} data-testid={dataTestid} />
      </ChartTooltipContainer>
    </Box>
  );
};

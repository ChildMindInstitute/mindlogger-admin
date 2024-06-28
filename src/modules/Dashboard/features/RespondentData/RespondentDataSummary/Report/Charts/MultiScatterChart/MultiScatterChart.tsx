import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
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
import { Scatter } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

import { locales, observerStyles } from 'shared/consts';
import { useStaticContent } from 'shared/hooks/useStaticContent';
import { StyledObserverTarget } from 'shared/styles';

import { scatterChartTooltipHandler } from '../Charts.utils';
import { ChartType, SetTooltipData } from '../Chart.types';
import { getData, getOptions } from './MultiScatterChart.utils';
import { MultiScatterChartProps } from './MultiScatterChart.types';
import { ChartTooltip } from './ChartTooltip';
import { ChartTooltipContainer } from '../ChartTooltipContainer';

export const MultiScatterChart = ({
  color,
  minDate,
  maxDate,
  minY,
  maxY,
  height,
  options,
  responseType,
  answers,
  versions,
  useCategory = false,
  'data-testid': dataTestid,
  isStaticActive,
}: MultiScatterChartProps) => {
  const { i18n } = useTranslation('app');
  const chartRef = useRef<ChartJSOrUndefined<'scatter', { x: Date; y: number }[], unknown> | null>(
    null,
  );
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const isHovered = useRef(false);
  const targetSelector = `${dataTestid}-target`;
  const { isStatic } = useStaticContent({ targetSelector, isStaticActive });

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
          options,
          responseType,
          tooltipHandler,
          useCategory,
        })}
        data={getData({ maxY, answers, versions, color, useCategory })}
        plugins={[ChartDataLabels]}
      />
    ),
    [
      answers,
      lang,
      color,
      minDate,
      maxDate,
      versions,
      maxY,
      minY,
      options,
      responseType,
      useCategory,
    ],
  );

  return (
    <Box sx={{ height, position: 'relative' }} data-testid={dataTestid}>
      <StyledObserverTarget className={targetSelector} sx={observerStyles} />
      {isStatic ? (
        <Skeleton variant="rounded" height={'100%'} />
      ) : (
        <>
          {renderChart}
          <ChartTooltipContainer
            ref={tooltipRef}
            onMouseEnter={() => {
              isHovered.current = true;
            }}
            onMouseLeave={hideTooltip}
            data-testid={dataTestid}
          >
            <ChartTooltip data={tooltipData} data-testid={dataTestid} />
          </ChartTooltipContainer>
        </>
      )}
    </Box>
  );
};

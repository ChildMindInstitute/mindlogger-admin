import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  TimeScale,
  ScriptableTooltipContext,
  TooltipItem,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

import { locales } from 'shared/consts';

import { getOptions, getData } from './MultiScatterChart.utils';
import { MultiScatterChartProps } from './MultiScatterChart.types';
import { ChartTooltip } from './ChartTooltip';
import { TOOLTIP_OFFSET_TOP, TOOLTIP_OFFSET_LEFT } from './MultiScatterChart.const';

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
}: MultiScatterChartProps) => {
  const { i18n } = useTranslation('app');
  const chartRef = useRef<ChartJSOrUndefined<'scatter', { x: Date; y: number }[], unknown> | null>(
    null,
  );
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

  const tooltipHandler = (context: ScriptableTooltipContext<'scatter'>) => {
    if (context.tooltip.dataPoints?.find((dataPoint) => dataPoint.dataset.xAxisID === 'x2')) return; // hide the tooltip for version axis

    const tooltipEl = tooltipRef.current;

    if (!tooltipEl) return;

    const { tooltip } = context;
    const { dataPoints } = tooltip;

    if (!tooltip.opacity && !isHovered.current) {
      tooltipEl.style.display = 'none';

      return;
    }

    const chart = chartRef.current;

    if (chart) {
      setTooltipData(dataPoints);
      const position = chart.canvas.getBoundingClientRect();
      const left = position.left + tooltip.caretX;
      const top = position.top + tooltip.caretY;

      tooltipEl.style.display = 'block';
      tooltipEl.style.top = `${top - TOOLTIP_OFFSET_TOP}px`;
      tooltipEl.style.left = `${left - TOOLTIP_OFFSET_LEFT}px`;
    }
  };

  const renderChart = useMemo(
    () => (
      <Scatter
        ref={chartRef}
        height={height}
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
    <>
      {renderChart}
      <ChartTooltip
        ref={tooltipRef}
        data={tooltipData}
        onMouseEnter={() => {
          isHovered.current = true;
        }}
        onMouseLeave={hideTooltip}
      />
    </>
  );
};

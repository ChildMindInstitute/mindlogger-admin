import { useMemo, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  TimeScale,
  TooltipItem,
  ScriptableTooltipContext,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { Scatter } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { locales } from 'shared/consts';

import { TOOLTIP_OFFSET_LEFT, TOOLTIP_OFFSET_TOP } from './ScatterChart.const';
import { getData, getOptions } from './ScatterChart.utils';
import { ScatterChartProps } from './ScatterChart.types';
import { ChartTooltip } from './ChartTooltip';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, TimeScale);

export const ScatterChart = ({
  height = '5rem',
  responses,
  versions,
  minDate,
  maxDate,
}: ScatterChartProps) => {
  const { i18n } = useTranslation('app');

  const [tooltipData, setTooltipData] = useState<TooltipItem<'scatter'> | null>(null);
  const chartRef = useRef<ChartJSOrUndefined<'scatter', { x: Date; y: number }[], unknown> | null>(
    null,
  );
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const isHovered = useRef(false);

  const lang = i18n.language as keyof typeof locales;

  const hideTooltip = () => {
    const tooltipEl = tooltipRef.current;

    if (!tooltipEl) return;

    isHovered.current = false;
    tooltipEl.style.display = 'none';
  };

  const tooltipHandler = (context: ScriptableTooltipContext<'scatter'>) => {
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
      setTooltipData(dataPoints[0]);
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
        options={getOptions(lang, minDate, maxDate, tooltipHandler)}
        data={getData(responses, versions)}
        plugins={[ChartDataLabels]}
      />
    ),
    [chartRef, minDate, maxDate, responses, versions, lang],
  );

  return (
    <Box sx={{ height, width: '100%' }}>
      {renderChart}
      <ChartTooltip
        ref={tooltipRef}
        data={tooltipData}
        onMouseEnter={() => {
          isHovered.current = true;
        }}
        onMouseLeave={hideTooltip}
      />
    </Box>
  );
};

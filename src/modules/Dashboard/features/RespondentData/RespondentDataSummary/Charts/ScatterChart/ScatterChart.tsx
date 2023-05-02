import { useRef, useState } from 'react';

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

import { getData, getOptions, mocked } from './ScatterChart.const';
import { ScatterChartProps } from './ScatterChart.types';
import { ChartTooltipPosition } from './ChartTooltip/ChartTooltip.types';
import { ChartTooltip } from './ChartTooltip';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, TimeScale);

export const ScatterChart = ({ height = '50px' }: ScatterChartProps) => {
  const { i18n } = useTranslation('app');
  const [tooltipPosition, setTooltipPosition] = useState<ChartTooltipPosition | null>(null);
  const [tooltipData, setTooltipData] = useState<TooltipItem<'scatter'> | null>(null);
  const chartRef = useRef<ChartJSOrUndefined<'scatter', { x: Date; y: number }[], unknown> | null>(
    null,
  );

  const tooltipHandler = (context: ScriptableTooltipContext<'scatter'>) => {
    const { tooltip } = context;
    const { dataPoints } = tooltip;
    if (tooltip.opacity === 0) {
      setTooltipPosition(null);

      return;
    }

    const chart = chartRef.current;

    if (chart) {
      const position = chart.canvas.getBoundingClientRect();
      const left = position.left + tooltip.caretX;
      const top = position.top + tooltip.caretY;

      setTooltipPosition({ top: `${top}px`, left: `${left}px` });
      setTooltipData(dataPoints[0]);
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Scatter
        ref={chartRef}
        height={height}
        options={getOptions(i18n.language as keyof typeof locales, mocked, tooltipHandler)}
        data={getData(mocked)}
        plugins={[ChartDataLabels]}
      />
      {tooltipPosition && tooltipData && (
        <ChartTooltip data={tooltipData} position={tooltipPosition} />
      )}
    </Box>
  );
};

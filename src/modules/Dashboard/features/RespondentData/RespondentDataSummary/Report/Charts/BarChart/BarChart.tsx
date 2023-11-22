import { useMemo, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  ScriptableTooltipContext,
  BarElement,
  Legend,
  CategoryScale,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Box } from '@mui/material';

import { legendMargin, setTooltipStyles } from '../Charts.utils';
import { ChartType } from '../Chart.types';
import { StyledChartContainer } from '../Chart.styles';
import { getDatasets, getOptions } from './BarChart.utils';
import { BarChartProps, TooltipData } from './BarChart.types';
import { ChartTooltip } from './ChartTooltip';

ChartJS.register(BarElement, CategoryScale, Legend);

export const BarChart = ({ chartData }: BarChartProps) => {
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const isHovered = useRef(false);

  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  const hideTooltip = () => {
    const tooltipEl = tooltipRef.current;

    if (!tooltipEl) return;

    isHovered.current = false;
    tooltipEl.style.display = 'none';
  };

  const tooltipHandler = (context: ScriptableTooltipContext<'bar'>) => {
    const tooltipEl = tooltipRef.current;

    if (!tooltipEl) return;

    const { tooltip } = context;
    const { dataPoints } = tooltip;

    if (!tooltip.opacity && !isHovered.current) {
      tooltipEl.style.display = 'none';

      return;
    }

    const chart = chartRef.current;

    if (chart && dataPoints.length) {
      const dataPoint = dataPoints[0];
      setTooltipData({
        backgroundColor: dataPoint.dataset.backgroundColor as string,
        label: dataPoint.dataset.label as string,
        value: dataPoint.raw as number,
      });
      const {
        element: { x: positionX, y: positionY },
      } = dataPoint;
      setTooltipStyles({ chartType: ChartType.BarChart, tooltipEl, positionX, positionY });
    }
  };

  const data = {
    labels: [''],
    datasets: getDatasets(chartData),
  };

  const renderChart = useMemo(
    () => (
      <Bar
        ref={chartRef}
        plugins={[legendMargin]}
        options={getOptions(chartData, tooltipHandler)}
        data={data}
      />
    ),
    [chartData],
  );

  return (
    <Box sx={{ position: 'relative' }}>
      <StyledChartContainer>{renderChart}</StyledChartContainer>
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

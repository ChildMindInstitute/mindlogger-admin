import { useMemo, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  ScriptableTooltipContext,
  BarElement,
  Legend,
  CategoryScale,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { legendMargin } from '../Charts.utils';
import { TOOLTIP_OFFSET_LEFT, TOOLTIP_OFFSET_TOP } from '../Charts.const';
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
      const position = chart.canvas.getBoundingClientRect();
      const left = position.left + tooltip.caretX;
      const top = position.top + tooltip.caretY;

      tooltipEl.style.display = 'block';
      tooltipEl.style.top = `${top - TOOLTIP_OFFSET_TOP}px`;
      tooltipEl.style.left = `${left - TOOLTIP_OFFSET_LEFT}px`;
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
    <>
      <StyledChartContainer>{renderChart}</StyledChartContainer>
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

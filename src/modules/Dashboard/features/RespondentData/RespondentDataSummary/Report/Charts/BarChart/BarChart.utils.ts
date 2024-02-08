import { LinearScale, ScriptableTooltipContext } from 'chart.js';

import { variables } from 'shared/styles';

import { COLORS, commonLabelsProps, SUBSCALES_CHART_LABEL_WIDTH_Y } from '../Charts.const';
import { BORDER_RADIUS } from './BarChart.const';
import { ChartData } from './BarChart.types';

export const getDatasets = (chartData: ChartData[]) =>
  chartData.map((item, index) => ({
    label: item.label,
    data: [item.score],
    backgroundColor: COLORS[index % COLORS.length],
    borderRadius: BORDER_RADIUS,
    maxBarThickness: 64,
    categoryPercentage: 0.35,
  }));

export const getOptions = (
  chartData: ChartData[],
  tooltipHandler: (context: ScriptableTooltipContext<'bar'>) => void,
  min: number,
  max: number,
  stepSize: number,
) => ({
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      align: 'start' as const,
      labels: commonLabelsProps,
    },
    tooltip: {
      enabled: false,
      external: tooltipHandler,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: variables.palette.outline_variant,
        drawTicks: false,
      },
      border: {
        display: false,
        dash: [8, 8],
      },
      afterFit(scaleInstance: LinearScale) {
        scaleInstance.width = SUBSCALES_CHART_LABEL_WIDTH_Y;
      },
      ticks: {
        stepSize,
        color: variables.palette.on_surface,
        font: {
          family: 'Atkinson',
          size: 14,
        },
      },
      suggestedMin: min,
      suggestedMax: max,
    },
    x: {
      grid: {
        display: false,
        drawTicks: false,
      },
      border: {
        display: false,
      },
    },
  },
});

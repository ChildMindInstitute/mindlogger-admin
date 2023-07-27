import { LinearScale, ScriptableTooltipContext } from 'chart.js';

import { pluck } from 'shared/utils';
import { variables } from 'shared/styles';

import { COLORS, OFFSET_Y_MAX, SUBSCALES_CHART_LABEL_WIDTH_Y } from '../Charts.const';
import { ChartData } from './BarChart.types';
import { BORDER_RADIUS } from './BarChart.const';

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
) => {
  const maxScore = Math.max(...pluck(chartData, 'score'));

  return {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        align: 'start' as const,
        labels: {
          color: variables.palette.on_surface,
          font: {
            family: 'Atkinson',
            size: 14,
          },
        },
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
          stepSize: Math.ceil(maxScore / 16),
          color: variables.palette.on_surface,
          font: {
            family: 'Atkinson',
            size: 14,
          },
        },
        suggestedMax: maxScore + OFFSET_Y_MAX,
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
  };
};

import { LinearScale } from 'chart.js';

import { COLORS } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/ResponseOptions/ResponseOptions.const';

import { pluck } from 'shared/utils';
import { variables } from 'shared/styles';

import { OFFSET_Y_MAX, SUBSCALES_CHART_LABEL_WIDTH_Y } from '../Charts.const';
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

export const getOptions = (chartData: ChartData[]) => {
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
        backgroundColor: variables.palette.surface2,
        bodyColor: variables.palette.on_surface,
        padding: {
          x: 24,
          y: 24,
        },
        cornerRadius: 12,
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

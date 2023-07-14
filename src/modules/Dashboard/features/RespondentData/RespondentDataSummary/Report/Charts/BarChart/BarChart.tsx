import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { variables } from 'shared/styles';
import { pluck } from 'shared/utils';

import { getDatasets } from './BarChart.utils';
import { BarChartProps, CustomLegend } from './BarChart.types';
import { OFFSET_Y_MAX, SUBSCALES_CHART_LABEL_WIDTH_Y } from '../Charts.const';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const BarChart = ({ chartData }: BarChartProps) => {
  const maxScore = Math.max(...pluck(chartData, 'score'));

  const options = {
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

  const legendMargin = {
    id: 'legendMargin',
    beforeInit: (chart: ChartJS) => {
      const originalFit = (chart.legend as CustomLegend).fit;
      (chart.legend as CustomLegend).fit = function fit() {
        originalFit.bind(chart.legend)();
        this.height += 42;
      };
    },
  };

  const data = {
    labels: [''],
    datasets: getDatasets(chartData),
  };

  return <Bar plugins={[legendMargin]} options={options} data={data} />;
};

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

import { getDatasets } from './BarChart.utils';
import { BarChartProps, CustomLegend } from './BarChart.types';
import { BAR_CHART_LABEL_WIDTH_Y } from '../Charts.const';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const BarChart = ({ chartData }: BarChartProps) => {
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
        afterFit(scaleInstance: LinearScale) {
          scaleInstance.width = BAR_CHART_LABEL_WIDTH_Y;
        },
        grid: {
          color: variables.palette.outline_variant,
          drawTicks: false,
        },
        border: {
          display: false,
          dash: [8, 8],
        },
        ticks: {
          stepSize: 2,
          color: variables.palette.on_surface,
          font: {
            family: 'Atkinson',
            size: 14,
          },
        },
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

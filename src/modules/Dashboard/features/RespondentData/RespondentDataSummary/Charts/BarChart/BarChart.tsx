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

import { mockedSubscales as chartData } from './mock';
import { getDatasets } from './BarChart.utils';
import { CustomLegend } from './BarChart.types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const BarChart = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
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
        grid: {
          color: variables.palette.outline_variant,
        },
        border: {
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

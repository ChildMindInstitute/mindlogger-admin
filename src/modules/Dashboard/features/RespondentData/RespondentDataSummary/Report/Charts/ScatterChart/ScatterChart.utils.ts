import { ScriptableTooltipContext } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';

import { variables } from 'shared/styles';
import { locales } from 'shared/consts';

import { ExtendedChartDataset } from './ScatterChart.types';
import { getStepSize, getTimeConfig } from '../Charts.utils';
import { Response, Version } from '../../Report.types';

export const getOptions = (
  lang: keyof typeof locales,
  minDate: Date,
  maxDate: Date,
  tooltipHandler: (context: ScriptableTooltipContext<'scatter'>) => void,
) => {
  const min = minDate.getTime();
  const max = maxDate.getTime();

  const timeConfig = getTimeConfig(min, max);
  const stepSize = getStepSize(min, max);

  return {
    maintainAspectRatio: false,
    responsive: true,
    clip: false as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        external: tooltipHandler,
      },
    },
    layout: {
      padding: {
        right: 30,
      },
    },
    scales: {
      y: {
        display: false,
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
      x: {
        adapters: {
          date: {
            locale: locales[lang],
          },
        },
        ...timeConfig,
        position: 'bottom' as const,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
          source: 'data' as const,
          font: {
            size: 11,
          },
        },
        min,
        max,
      },
      x1: {
        adapters: {
          date: {
            locale: locales[lang],
          },
        },
        ...timeConfig,
        ticks: {
          autoSkip: false,
          stepSize,
          font: {
            size: 11,
          },
        },
        position: 'bottom' as const,
        grid: {
          display: true,
          drawOnChartArea: false,
          drawTicks: true,
        },
        border: {
          display: false,
        },
        min,
        max,
      },
      x2: {
        ...timeConfig,
        position: 'top' as const,
        ticks: {
          source: 'data' as const,
          font: {
            size: 11,
          },
          display: false,
        },
        border: {
          display: false,
        },
        min,
        max,
      },
    },
  };
};

export const getData = (responses: Response[], versions: Version[]) => ({
  datasets: [
    {
      xAxisID: 'x',
      data: responses.map(({ date }) => ({ x: new Date(date), y: 0 })),
      borderWidth: 5,
      backgroundColor: variables.palette.primary,
      borderColor: variables.palette.primary,
      datalabels: {
        display: false,
      },
    },
    {
      xAxisID: 'x1',
      data: [],
    },
    {
      xAxisID: 'x2',
      labels: versions.map(({ version }) => version),
      data: versions.map(({ date }) => ({ x: new Date(date), y: 1 })),
      datalabels: {
        anchor: 'end' as const,
        align: 'right' as const,
        font: {
          size: 11,
        },
        formatter: (_: unknown, context: Context) => {
          const dataset = context.dataset as ExtendedChartDataset;

          return dataset.labels[context.dataIndex];
        },
      },
      pointStyle: false as const,
    },
  ],
});

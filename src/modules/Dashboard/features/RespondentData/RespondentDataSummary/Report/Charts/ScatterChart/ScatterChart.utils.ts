import { ChartDataset, ScriptableTooltipContext } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';

import { variables } from 'shared/styles';
import { locales } from 'shared/consts';
import { Version } from 'api';

import { getTimelineStepSize, getTimeConfig } from '../Charts.utils';
import { POINT_RADIUS_DEFAULT } from '../Charts.const';
import { Completion } from '../../Report.types';

export const getOptions = (
  lang: keyof typeof locales,
  minDate: Date,
  maxDate: Date,
  tooltipHandler: (context: ScriptableTooltipContext<'scatter'>) => void,
) => {
  const min = minDate.getTime();
  const max = maxDate.getTime();

  const timeConfig = getTimeConfig(min, max);
  const timelineStepSize = getTimelineStepSize(min, max);

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
          stepSize: 1,
          autoSkip: false,
        },
        min: 0,
        max: 1,
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
          stepSize: timelineStepSize,
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

export const getData = (completions: Completion[], versions: Version[]) => ({
  datasets: [
    {
      borderWidth: 1,
      pointRadius: POINT_RADIUS_DEFAULT,
      pointBorderColor: variables.palette.white,
      xAxisID: 'x',
      data: completions.map(({ id, endDatetime, areSubscalesVisible, reviewCount, isFlow }) => ({
        x: new Date(endDatetime),
        y: 0,
        id,
        areSubscalesVisible,
        reviewCount,
        isFlow,
      })),
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
      data: versions.map(({ createdAt }) => ({ x: new Date(createdAt), y: 1 })),
      datalabels: {
        anchor: 'end' as const,
        align: 'right' as const,
        font: {
          size: 11,
        },
        formatter: (_: unknown, context: Context) => {
          const dataset = context.dataset as ChartDataset & {
            labels: string[];
          };

          return dataset.labels[context.dataIndex];
        },
      },
      pointStyle: false as const,
    },
  ],
});

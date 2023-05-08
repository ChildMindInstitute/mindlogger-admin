import { max, min } from 'date-fns';
import debounce from 'lodash.debounce';
import { ScriptableTooltipContext } from 'chart.js';

import { variables } from 'shared/styles';
import { CHART_DEBOUNCE_VALUE, locales } from 'shared/consts';

import { Data } from './ScatterChart.types';

export const mocked = {
  responses: [new Date('2023-11-06'), new Date('2023-11-27'), new Date('2023-12-07')],
  versions: [new Date('2023-11-20')],
};

const commonConfig = {
  type: 'time' as const,
  time: {
    unit: 'day' as const,
    displayFormats: {
      month: 'dd mmm' as const,
    },
  },
};

export const getOptions = (
  lang: keyof typeof locales,
  data: Data,
  tooltipHandler: (context: ScriptableTooltipContext<'scatter'>) => void,
) => {
  const datesArr = [...data.responses, ...data.versions];
  const maxDate = max(datesArr).toString();
  const minDate = min(datesArr).toString();

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
        // intersect: false,
        position: 'nearest' as const,
        // mode: 'point' as const,
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
        ...commonConfig,
        position: 'bottom' as const,
        grid: {
          display: false,
        },
        ticks: {
          source: 'data' as const,
          font: {
            size: 11,
          },
        },
        min: minDate,
        max: maxDate,
      },
      x2: {
        ...commonConfig,
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
        min: minDate,
        max: maxDate,
      },
    },
  };
};

export const getData = (data: Data) => ({
  datasets: [
    {
      xAxisID: 'x',
      data: data?.responses.map((item: Date) => ({ x: item, y: 0 })),
      borderWidth: 5,
      backgroundColor: variables.palette.primary,
      borderColor: variables.palette.primary,
      datalabels: {
        display: false,
      },
    },
    {
      xAxisID: 'x2',
      data: data?.versions.map((item: Date) => ({ x: item, y: 1 })),
      datalabels: {
        anchor: 'start' as const,
        align: 'right' as const,
        font: {
          size: 11,
        },
        formatter() {
          // TODO: add logic with real data
          return '1.0.1';
        },
      },
      pointStyle: false as const,
    },
  ],
});

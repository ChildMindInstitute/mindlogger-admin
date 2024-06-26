import { LinearScale } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';

import { variables } from 'shared/styles';
import { ItemResponseType, locales } from 'shared/consts';
import { ItemOption } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

import {
  DataProps,
  ExtendedChartDataset,
  OptionsProps,
  ScalesType,
} from './MultiScatterChart.types';
import { getTimelineStepSize, getTimeConfig, truncateString } from '../Charts.utils';
import { LABEL_WIDTH_Y, POINT_RADIUS_DEFAULT } from '../Charts.const';

export const getOptions = ({
  lang,
  options,
  responseType,
  minY,
  maxY,
  minDate,
  maxDate,
  tooltipHandler,
  useCategory,
}: OptionsProps) => {
  const min = minDate.getTime();
  const max = maxDate.getTime();

  const mapper: Record<string, ItemOption> = options.reduce(
    (acc, option) => ({
      ...acc,
      [option.value]: option,
    }),
    {},
  );

  const timeConfig = getTimeConfig(min, max);
  const timelineStepSize = getTimelineStepSize(min, max);
  const yAxisLabels = ['', ...options.map(({ text }) => text as string)]; // empty string is used for version tick

  const crossAlign =
    responseType === ItemResponseType.Slider ? ('near' as const) : ('far' as const);

  return {
    responsive: true,
    maintainAspectRatio: false,
    clip: false as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        mode: 'point' as const,
        external: tooltipHandler,
      },
    },
    scales: {
      y: {
        type: (useCategory ? 'category' : undefined) as ScalesType,
        labels: useCategory ? yAxisLabels : undefined,
        border: {
          display: false,
        },
        min: minY,
        max: maxY + 1,
        afterFit(scaleInstance: LinearScale) {
          scaleInstance.width = LABEL_WIDTH_Y;
        },
        ticks: {
          crossAlign,
          stepSize: 1,
          autoSkip: false,
          callback: (value: number | string) => {
            if (
              (!useCategory && value === maxY + 1) ||
              (useCategory && yAxisLabels[value as number] === '')
            )
              return;
            const label = useCategory ? yAxisLabels[value as number] : mapper[value]?.text;

            return label ? truncateString(label.toString()) : label;
          },
          color: variables.palette.on_surface,
          font: {
            family: 'Atkinson',
            size: 14,
          },
        },
      },
      x: {
        adapters: {
          date: {
            locale: locales[lang],
          },
        },
        ...timeConfig,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          display: false,
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
        border: {
          display: false,
        },
        ticks: {
          source: 'data' as const,
          font: {
            size: 11,
          },
          display: false,
        },
        min,
        max,
      },
    },
  };
};

export const getData = ({ maxY, answers, versions, color, useCategory }: DataProps) => ({
  datasets: [
    {
      pointRadius: POINT_RADIUS_DEFAULT,
      datalabels: {
        display: false,
      },
      data: answers?.map(({ date, answer: { value } }) => ({
        x: new Date(date),
        y: value,
      })),
      borderWidth: 0,
      backgroundColor: color,
    },
    {
      xAxisID: 'x1',
      data: [],
    },
    {
      xAxisID: 'x2',
      labels: versions.map(({ version }) => version),
      data: versions.map(({ createdAt }) => ({
        x: new Date(createdAt),
        y: useCategory ? '' : maxY + 1,
      })),
      datalabels: {
        anchor: 'center' as const,
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

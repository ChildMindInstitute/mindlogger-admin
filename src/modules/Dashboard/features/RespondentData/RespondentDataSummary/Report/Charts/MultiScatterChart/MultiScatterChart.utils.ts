import { LinearScale } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';

import { variables } from 'shared/styles';
import { ItemResponseType, locales } from 'shared/consts';
import { SingleAndMultipleSelectItemResponseValues } from 'shared/state/Applet/Applet.schema';

import { DataProps, ExtendedChartDataset, OptionsProps } from './MultiScatterChart.types';
import { getStepSize, getTimeConfig, truncateString } from '../Charts.utils';
import { LABEL_WIDTH_Y } from '../Charts.const';

export const getOptions = ({
  lang,
  responseValues,
  responseType,
  minY,
  maxY,
  minDate,
  maxDate,
}: OptionsProps) => {
  const min = minDate.getTime();
  const max = maxDate.getTime();

  const timeConfig = getTimeConfig(min, max);
  const stepSize = getStepSize(min, max);

  const crossAlign =
    responseType === ItemResponseType.Slider ? ('near' as const) : ('far' as const);

  const mapperPointOption: { [key: string | number]: string } =
    responseType !== ItemResponseType.Slider
      ? (responseValues as SingleAndMultipleSelectItemResponseValues)?.options.reduce(
          (mapper, { text }, index) => ({
            ...mapper,
            [index + 1]: text,
          }),
          {},
        )
      : {};

  return {
    responsive: true,
    clip: false as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      y: {
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
          callback: (value: string | number) => {
            if (value === maxY + 1) return;

            const label =
              responseType === ItemResponseType.Slider
                ? value.toString()
                : mapperPointOption[value];

            return truncateString(label);
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

export const getData = ({ maxY, responseValues, responseType, answers, versions }: DataProps) => {
  const mapperIdPoint: { [key: string]: number } =
    responseType !== ItemResponseType.Slider
      ? (responseValues as SingleAndMultipleSelectItemResponseValues)?.options.reduce(
          (mapper, { id }, index) => ({
            ...mapper,
            [id]: index + 1,
          }),
          {},
        )
      : {};

  return {
    datasets: [
      {
        pointRadius: 6,
        pointHoverRadius: 7,
        datalabels: {
          display: false,
        },
        data: answers.map(({ date, value }) => ({
          x: date,
          y: responseType === ItemResponseType.Slider ? value : mapperIdPoint[value],
        })),
        borderWidth: 0,
        backgroundColor: variables.palette.orange,
      },
      {
        xAxisID: 'x1',
        data: [],
      },
      {
        xAxisID: 'x2',
        labels: versions.map(({ version }) => version),
        data: versions.map(({ date }) => ({ x: date, y: maxY + 1 })),
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
  };
};

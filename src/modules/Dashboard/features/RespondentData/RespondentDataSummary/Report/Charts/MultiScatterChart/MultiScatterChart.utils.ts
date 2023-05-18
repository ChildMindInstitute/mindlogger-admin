import { Context } from 'chartjs-plugin-datalabels';

import { variables } from 'shared/styles';
import { locales } from 'shared/consts';

import { Version, ItemAnswer, FormattedItemAnswer } from '../../Report.types';
import { MultiScatterResponseValues } from '../../ResponseOptions/ResponseOptions.types';
import { ExtendedChartDataset } from './MultiScatterChart.types';
import { commonConfig } from './MultiScatterChart.const';

const formatDateToNumber = (date: string | Date) =>
  (typeof date === 'string' ? new Date(date) : date).getTime();

export const formatAnswers = (answers: ItemAnswer[]) =>
  answers.reduce((flattenAnswers: FormattedItemAnswer[], { value, date }: ItemAnswer) => {
    if (Array.isArray(value)) {
      const flattenValues = value.map((item) => ({ value: item, date }));

      return [...flattenAnswers, ...flattenValues];
    }

    return [...flattenAnswers, { value, date }];
  }, []);

export const getOptions = (
  lang: keyof typeof locales,
  responseValues: MultiScatterResponseValues,
  minDate: string | Date,
  maxDate: string | Date,
) => {
  const min = formatDateToNumber(minDate);
  const max = formatDateToNumber(maxDate);

  const mapperPointOption: { [key: number]: string } = responseValues?.options.reduce(
    (mapper, { text }, index) => ({
      ...mapper,
      [index + 1]: text,
    }),
    {},
  );

  const maxY = Object.values(mapperPointOption).length + 1;

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
        min: 1,
        max: maxY,
        ticks: {
          stepSize: 1,
          callback: (_: unknown, value: number) => mapperPointOption[value + 1],
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
        ...commonConfig,
        grid: {
          display: false,
        },
        ticks: {
          source: 'data' as const,
          font: {
            size: 11,
          },
        },
        min,
        max,
      },
      x2: {
        ...commonConfig,
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

export const getData = (
  responseValues: MultiScatterResponseValues,
  answers: FormattedItemAnswer[],
  versions: Version[],
) => {
  const mapperIdPoint: { [key: string]: number } = responseValues?.options.reduce(
    (mapper, { id }, index) => ({
      ...mapper,
      [id]: index + 1,
    }),
    {},
  );

  const maxY = Object.values(mapperIdPoint).length + 1;

  return {
    datasets: [
      {
        pointRadius: 6,
        pointHoverRadius: 7,
        datalabels: {
          display: false,
        },
        data: answers.map(({ date, value }) => ({ x: date, y: mapperIdPoint[value] })),
        borderWidth: 0,
        backgroundColor: variables.palette.orange,
      },
      {
        xAxisID: 'x2',
        labels: versions.map(({ version }) => version),
        data: versions.map(({ date }) => ({ x: date, y: maxY })),
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

import { variables } from 'shared/styles';
import { locales } from 'shared/consts';

import { Context } from 'chartjs-plugin-datalabels';

import { Data, ExtendedChartDataset } from './MultiScatterChart.types';
import { commonConfig } from './MultiScatterChart.const';

export const getOptions = (lang: keyof typeof locales, data: Data) => {
  // TODO: min & max dates - get from filters
  const maxDate = new Date(2023, 3, 29).getTime();
  const minDate = new Date(2023, 4, 20).getTime();

  const mapperPointOption: { [key: number]: string } = data.responseOptions.reduce(
    (mapper, { option }, index) => ({
      ...mapper,
      [index + 1]: option,
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
        min: minDate,
        max: maxDate,
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
        min: minDate,
        max: maxDate,
      },
    },
  };
};

export const getData = (data: Data) => {
  const mapperIdPoint: { [key: string]: number } = data.responseOptions.reduce(
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
        data: data?.responses.reduce(
          (acc: { x: Date | string; y: string | number }[], { dates, id }) => [
            ...acc,
            ...dates.map((date) => ({ x: date, y: mapperIdPoint[id] })),
          ],
          [],
        ),
        borderWidth: 0,
        backgroundColor: variables.palette.orange,
      },
      {
        xAxisID: 'x2',
        labels: data?.versions.map(({ version }) => version),
        data: data?.versions.map(({ date }) => ({ x: date, y: maxY })),
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

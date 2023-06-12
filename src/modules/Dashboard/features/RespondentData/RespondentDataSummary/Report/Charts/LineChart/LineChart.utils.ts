import { max, min } from 'date-fns';
import { Context } from 'chartjs-plugin-datalabels';
import { LegendItem, ChartData } from 'chart.js';

import { variables } from 'shared/styles';

import { ExtendedChartDataset, SubscaleChartData, Tick } from './LineChart.types';
import { COLORS } from './LineChart.const';
import { locales } from '../Charts.const';
import { getStepSize, getTimeConfig } from '../Charts.utils';

export const getOptions = (lang: keyof typeof locales, data: SubscaleChartData) => {
  const responses = data.subscales.map((subscale) => subscale.responses);
  const responsesDates = responses.flat().map((response) => response.date);
  const versionsDates = data.versions.map((version) => version.date);

  const minDate = min([...responsesDates, ...versionsDates]).getTime();
  const maxDate = max([...responsesDates, ...versionsDates]).getTime();

  const timeConfig = getTimeConfig(minDate, maxDate);
  const stepSize = getStepSize(minDate, maxDate);

  return {
    responsive: true,
    clip: false as const,
    plugins: {
      legend: {
        align: 'start' as const,
        labels: {
          filter: (legendItem: LegendItem, chart: ChartData<'line'>) => {
            const versionIndex = chart.datasets.findIndex((dataset) => dataset.xAxisID === 'x2');

            return legendItem.datasetIndex !== versionIndex;
          },
          color: variables.palette.on_surface,
          font: {
            family: 'Atkinson',
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: (value: Tick) => {
            const lastTickIndex = value.chart.scales.y.ticks.length - 1;
            if (lastTickIndex === value.index) {
              return 'transparent';
            }

            return variables.palette.outline_variant;
          },
        },
        border: {
          dash: [8, 8],
        },
        ticks: {
          stepSize: 2,
          color: (value: Tick) => {
            const lastTickIndex = value.chart.scales.y.ticks.length - 1;
            if (lastTickIndex === value.index) {
              return 'transparent';
            }

            return variables.palette.on_surface;
          },
          font: {
            family: 'Atkinson',
            size: 14,
          },
        },
      },
      x: {
        ...timeConfig,
        adapters: {
          date: {
            locale: locales[lang as keyof typeof locales],
          },
        },
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
        },
        position: 'bottom' as const,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        min: minDate,
        max: maxDate,
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
        min: minDate,
        max: maxDate,
      },
    },
  };
};

export const getData = (data: SubscaleChartData) => {
  const responses = data.subscales.map((subscale) => subscale.responses);
  const responsesScores = responses.flat().map((response) => response.score);

  const maxScore = Math.max(...responsesScores);

  return {
    datasets: [
      ...data.subscales.map((subscale, index) => ({
        xAxisID: 'x',
        label: subscale.name,
        data: subscale.responses.map(({ date, score }) => ({
          x: date,
          y: score,
        })),
        borderColor: COLORS[index % COLORS.length],
        backgroundColor: COLORS[index % COLORS.length],
        datalabels: {
          display: false,
        },
      })),
      {
        xAxisID: 'x1',
        data: [],
      },
      {
        xAxisID: 'x2',
        labels: data.versions.map(({ version }) => version),
        data: data.versions.map(({ date }) => ({
          x: date,
          y: maxScore + 2,
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
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        pointStyle: false as const,
      },
    ],
  };
};

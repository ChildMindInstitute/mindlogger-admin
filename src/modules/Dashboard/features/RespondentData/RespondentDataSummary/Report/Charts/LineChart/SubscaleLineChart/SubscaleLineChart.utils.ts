import { Context } from 'chartjs-plugin-datalabels';
import { LegendItem, ChartData, LinearScale, ScriptableTooltipContext, ChartDataset } from 'chart.js';

import { variables } from 'shared/styles';
import { Version } from 'api';

import {
  SUBSCALES_CHART_LABEL_WIDTH_Y,
  locales,
  POINT_RADIUS_DEFAULT,
  POINT_RADIUS_SECONDARY,
  COLORS,
  commonLabelsProps,
} from '../../Charts.const';
import { getTimelineStepSize, getTimeConfig } from '../../Charts.utils';
import { SubscaleChartData, Tick } from './SubscaleLineChart.types';

export const getOptions = (
  lang: keyof typeof locales,
  minDate: Date,
  maxDate: Date,
  tooltipHandler: (context: ScriptableTooltipContext<'line'>) => void,
  minY: number,
  maxY: number,
  stepSize: number,
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
        align: 'start' as const,
        labels: {
          filter: (legendItem: LegendItem, chart: ChartData<'line'>) => {
            const versionIndex = chart.datasets.findIndex(dataset => dataset.xAxisID === 'x2');
            const dateIndex = chart.datasets.findIndex(dataset => dataset.xAxisID === 'x1');

            return legendItem.datasetIndex !== versionIndex && legendItem.datasetIndex !== dateIndex;
          },
          ...commonLabelsProps,
        },
      },
      tooltip: {
        enabled: false,
        external: tooltipHandler,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawTicks: false,
          color: (value: Tick) => {
            const lastTickIndex = value.chart.scales.y.ticks.length - 1;
            if (lastTickIndex === value.index) {
              return 'transparent';
            }

            return variables.palette.outline_variant;
          },
        },
        border: {
          display: false,
          dash: [8, 8],
        },
        afterFit(scaleInstance: LinearScale) {
          scaleInstance.width = SUBSCALES_CHART_LABEL_WIDTH_Y;
        },
        ticks: {
          stepSize,
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
        suggestedMin: minY,
        suggestedMax: maxY,
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

export const getData = (data: SubscaleChartData, versions: Version[], max: number) => ({
  datasets: [
    ...data.subscales.map((subscale, index) => ({
      xAxisID: 'x',
      label: subscale.name,
      data: subscale.activityCompletions.map(({ date, score, optionText }) => ({
        x: date,
        y: score,
        optionText,
      })),
      borderColor: COLORS[index % COLORS.length],
      backgroundColor: COLORS[index % COLORS.length],
      datalabels: {
        display: false,
      },
      borderWidth: 1,
      pointRadius: subscale.activityCompletions.map(({ optionText }) =>
        optionText ? POINT_RADIUS_DEFAULT : POINT_RADIUS_SECONDARY,
      ),
      pointBorderColor: variables.palette.white,
    })),
    {
      xAxisID: 'x1',
      data: [],
    },
    {
      xAxisID: 'x2',
      labels: versions.map(({ version }) => version),
      data: versions.map(({ createdAt }) => ({
        x: new Date(createdAt),
        y: max,
      })),
      datalabels: {
        anchor: 'center' as const,
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
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      pointStyle: false as const,
    },
  ],
});

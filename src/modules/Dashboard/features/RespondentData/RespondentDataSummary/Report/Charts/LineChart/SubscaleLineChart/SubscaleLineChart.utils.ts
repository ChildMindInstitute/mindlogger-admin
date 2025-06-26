import {
  ChartData,
  ChartDataset,
  LegendItem,
  LinearScale,
  ScriptableTooltipContext,
} from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';

import { Version } from 'api';
import { TScoreSeverity } from 'modules/Builder/features/ActivitySettings/SubscalesConfiguration/LookupTable';
import { variables } from 'shared/styles';

import {
  COLORS,
  commonLabelsProps,
  locales,
  POINT_RADIUS_DEFAULT,
  POINT_RADIUS_SECONDARY,
  SUBSCALES_CHART_LABEL_WIDTH_Y,
} from '../../Charts.const';
import { getTimeConfig, getTimelineStepSize } from '../../Charts.utils';
import {
  COLOR_PLACEHOLDER,
  defaultSeveritySvg,
  mildSeveritySvg,
  minimalSeveritySvg,
  moderateSeveritySvg,
  severeSeveritySvg,
} from './SubscaleLineChart.const';
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
            const versionIndex = chart.datasets.findIndex((dataset) => dataset.xAxisID === 'x2');
            const dateIndex = chart.datasets.findIndex((dataset) => dataset.xAxisID === 'x1');

            return (
              legendItem.datasetIndex !== versionIndex && legendItem.datasetIndex !== dateIndex
            );
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
            family: 'Moderat',
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

export const getSeveritySvg = (severity: TScoreSeverity, color: string) => {
  let svg: string;

  switch (severity) {
    case 'Minimal':
      svg = minimalSeveritySvg;
      break;
    case 'Mild':
      svg = mildSeveritySvg;
      break;
    case 'Moderate':
      svg = moderateSeveritySvg;
      break;
    case 'Severe':
      svg = severeSeveritySvg;
      break;
    default:
      svg = defaultSeveritySvg;
      break;
  }

  return svg.replace(new RegExp(COLOR_PLACEHOLDER, 'g'), color);
};

export const getSeverityImageElement = (
  severity: TScoreSeverity,
  color: string,
): HTMLImageElement => {
  const image = new Image();
  const blob = new Blob([getSeveritySvg(severity, color)], { type: 'image/svg+xml' });
  image.src = URL.createObjectURL(blob);

  return image;
};

export const getData = (
  data: SubscaleChartData,
  versions: Version[],
  max: number,
  enableCahmiSubscaleScoring = false,
) => ({
  datasets: [
    ...data.subscales.map((subscale, index) => {
      const pointStyle = enableCahmiSubscaleScoring
        ? subscale.activityCompletions.map((completion) =>
            getSeverityImageElement(
              completion.severity as TScoreSeverity,
              COLORS[index % COLORS.length],
            ),
          )
        : undefined;

      return {
        xAxisID: 'x',
        label: subscale.name,
        data: subscale.activityCompletions.map(({ date, score, optionText, severity }) => ({
          x: date,
          y: score,
          optionText,
          severity,
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
        pointStyle,
      };
    }),
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

import { Context } from 'chartjs-plugin-datalabels';
import { ChartDataset, LinearScale, ScriptableTooltipContext } from 'chart.js';
import { format, isEqual } from 'date-fns';

import { DateFormats } from 'shared/consts';
import { variables } from 'shared/styles';
import { DEFAULT_DATE_MIN } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Report.const';
import { DEFAULT_DATE_MAX } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/RespondentDataSummary.const';

import { locales, POINT_RADIUS_DEFAULT, LABEL_WIDTH_Y } from '../../Charts.const';
import { getTimelineStepSize, getTimeConfig } from '../../Charts.utils';
import { DataProps } from './TimePickerLineChart.types';

export const getOptions = (
  lang: keyof typeof locales,
  minDate: Date,
  maxDate: Date,
  tooltipHandler: (context: ScriptableTooltipContext<'line'>) => void,
) => {
  const min = minDate.getTime();
  const max = maxDate.getTime();

  const timeConfig = getTimeConfig(min, max);
  const timelineStepSize = getTimelineStepSize(min, max);

  return {
    responsive: true,
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
        adapters: {
          date: {
            locale: locales[lang],
          },
        },
        type: 'time' as const,
        time: {
          unit: 'minute' as const,
          displayFormats: {
            minute: 'HH:mm' as const,
          },
        },
        border: {
          display: false,
        },
        afterFit(scaleInstance: LinearScale) {
          scaleInstance.width = LABEL_WIDTH_Y;
        },
        reverse: true,
        ticks: {
          callback: (value: string | number) => {
            const date = new Date(value);
            const hours = date.getHours();
            const mins = date.getMinutes();

            const isEvenHour = hours % 2 === 0 && mins === 0;
            const isDefaultDateMax = isEqual(date, DEFAULT_DATE_MAX);

            if (!isEvenHour && !isDefaultDateMax) return;

            return format(date, DateFormats.Time);
          },
          stepSize: 1,
          color: variables.palette.on_surface,
          font: {
            family: 'Atkinson',
            size: 14,
          },
        },
        min: DEFAULT_DATE_MIN.getTime(),
        max: DEFAULT_DATE_MAX.getTime(),
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

export const getData = ({ answers, versions, color }: DataProps) => ({
  datasets: [
    {
      xAxisID: 'x',
      pointRadius: POINT_RADIUS_DEFAULT,
      datalabels: {
        display: false,
      },
      data: answers.map(({ date, answer: { value } }) => ({
        x: new Date(date),
        y: value ? new Date(value) : value,
      })),
      borderWidth: 1,
      borderColor: color,
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
        y: DEFAULT_DATE_MIN,
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
      pointStyle: false as const,
    },
  ],
});

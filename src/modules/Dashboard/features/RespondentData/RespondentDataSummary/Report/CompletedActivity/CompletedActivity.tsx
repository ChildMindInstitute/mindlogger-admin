import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Scatter } from 'react-chartjs-2';
import { enUS, fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { max, min } from 'date-fns';
import { variables } from 'shared/styles';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, TimeScale);

const locales = {
  'en-US': enUS,
  fr,
};

const mocked = {
  responses: [new Date('2023-11-06'), new Date('2023-11-27'), new Date('2023-12-07')],
  versions: [new Date('2023-11-20')],
};

export const getOptions = (lang: keyof typeof locales, data: any) => {
  const maxDate = max([...mocked.responses, ...mocked.versions]);
  const minDate = min([...mocked.responses, ...mocked.versions]);

  return {
    maintainAspectRatio: false,
    responsive: true,
    clip: false,
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
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            month: 'dd mmm' as const,
          },
        },
        position: 'bottom' as const,
        grid: {
          display: false,
        },
        ticks: {
          source: 'data',
          font: {
            size: 11,
          },
        },
        min: minDate,
        max: maxDate,
      },
      x2: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            month: 'dd mmm' as const,
          },
        },
        position: 'top' as const,
        ticks: {
          source: 'data',
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

export const getData = (data: any) => ({
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
        formatter(item: { x: number; y: number }) {
          // TODO: add logic with real data
          return '1.0.1';
        },
      },
      pointStyle: false as const,
    },
  ],
});

export const CompletedActivity = () => {
  const { i18n } = useTranslation('app');

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Scatter
        height="50px"
        options={getOptions(i18n.language as keyof typeof locales, mocked) as any}
        data={getData(mocked)}
        plugins={[ChartDataLabels]}
      />
    </Box>
  );
};

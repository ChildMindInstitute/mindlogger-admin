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
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { locales } from 'shared/consts';

import { getData, getOptions, mocked } from './ScatterChart.const';
import { ScatterChartProps } from './ScatterChart.types';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, TimeScale);

export const ScatterChart = ({ height = '50px' }: ScatterChartProps) => {
  const { i18n } = useTranslation('app');

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Scatter
        height={height}
        options={getOptions(i18n.language as keyof typeof locales, mocked)}
        data={getData(mocked)}
        plugins={[ChartDataLabels]}
      />
    </Box>
  );
};

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

import { getData, getOptions, locales, mocked } from './ScatterChart.const';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, TimeScale);

export const ScatterChart = () => {
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

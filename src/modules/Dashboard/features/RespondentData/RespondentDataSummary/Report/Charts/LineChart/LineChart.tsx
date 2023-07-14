import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Tooltip,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';

import { FilterFormValues } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Report.types';
import { useDatavizFilters } from 'modules/Dashboard/hooks';

import { getOptions, getData } from './LineChart.utils';
import { CustomLegend, LineChartProps } from './LineChart.types';
import { locales } from '../Charts.const';

ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Tooltip, TimeScale);

export const LineChart = ({ data, versions }: LineChartProps) => {
  const { i18n } = useTranslation('app');

  const { watch } = useFormContext<FilterFormValues>();
  const { minDate, maxDate, filteredVersions } = useDatavizFilters(watch, versions);

  const lang = i18n.language as keyof typeof locales;

  const legendMargin = {
    id: 'legendMargin',
    beforeInit: (chart: ChartJS) => {
      const originalFit = (chart.legend as CustomLegend).fit;
      (chart.legend as CustomLegend).fit = function fit() {
        originalFit.bind(chart.legend)();
        this.height += 42;
      };
    },
  };

  const renderChart = useMemo(
    () => (
      <Line
        options={getOptions(lang, minDate, maxDate, data)}
        data={getData(data, filteredVersions)}
        plugins={[ChartDataLabels, legendMargin]}
      />
    ),
    [lang, minDate, maxDate, filteredVersions],
  );

  // TODO: add tooltips component
  return <>{renderChart}</>;
};

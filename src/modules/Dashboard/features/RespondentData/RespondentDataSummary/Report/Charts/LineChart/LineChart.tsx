import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Chart as ChartJS, Tooltip, TimeScale, Legend, ScriptableTooltipContext } from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

import { getOptionTextApi } from 'api';
import { useAsync } from 'shared/hooks';
import { FilterFormValues } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Report.types';
import { useDatavizFilters } from 'modules/Dashboard/hooks';

import { LINK_PATTERN, locales, TOOLTIP_OFFSET_LEFT, TOOLTIP_OFFSET_TOP } from '../Charts.const';
import { getOptions, getData } from './LineChart.utils';
import { CustomLegend, DataPointRaw, LineChartProps, TooltipData } from './LineChart.types';
import { ChartTooltip } from './ChartTooltip';

ChartJS.register(Tooltip, TimeScale, Legend);

export const LineChart = ({ data, versions }: LineChartProps) => {
  const { i18n } = useTranslation('app');
  const chartRef = useRef<ChartJSOrUndefined<'line', DataPointRaw[]> | null>(null);

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const isHovered = useRef(false);

  const [tooltipData, setTooltipData] = useState<TooltipData[] | null>(null);

  const { execute: getOptionText } = useAsync(getOptionTextApi);
  const { watch } = useFormContext<FilterFormValues>();
  const { minDate, maxDate, filteredVersions } = useDatavizFilters(watch, versions);

  const lang = i18n.language as keyof typeof locales;

  const hideTooltip = () => {
    const tooltipEl = tooltipRef.current;

    if (!tooltipEl) return;

    isHovered.current = false;
    tooltipEl.style.display = 'none';
  };

  const tooltipHandler = async (context: ScriptableTooltipContext<'line'>) => {
    const tooltipEl = tooltipRef.current;

    if (!tooltipEl) return;

    const { tooltip } = context;
    const { dataPoints } = tooltip;

    if (!tooltip.opacity && !isHovered.current) {
      tooltipEl.style.display = 'none';

      return;
    }

    const chart = chartRef.current;

    if (chart && dataPoints.length) {
      const tooltipDataPoints = await Promise.all(
        dataPoints.map(async (dataPoint) => {
          let optionText = (dataPoint.raw as DataPointRaw).optionText;

          if (optionText && optionText.match(LINK_PATTERN)) {
            optionText = (await getOptionText(optionText)).data;
          }

          return {
            date: (dataPoint.raw as DataPointRaw).x,
            backgroundColor: dataPoint.dataset.backgroundColor as string,
            label: dataPoint.dataset.label as string,
            value: (dataPoint.raw as DataPointRaw).y,
            optionText,
          };
        }),
      );

      setTooltipData(tooltipDataPoints);
      const position = chart.canvas.getBoundingClientRect();
      const left = position.left + tooltip.caretX;
      const top = position.top + tooltip.caretY;

      tooltipEl.style.display = 'block';
      tooltipEl.style.top = `${top - TOOLTIP_OFFSET_TOP}px`;
      tooltipEl.style.left = `${left - TOOLTIP_OFFSET_LEFT}px`;
    }
  };

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
        ref={chartRef}
        options={getOptions(lang, minDate, maxDate, data, tooltipHandler)}
        data={getData(data, filteredVersions)}
        plugins={[ChartDataLabels, legendMargin]}
      />
    ),
    [lang, minDate, maxDate, filteredVersions],
  );

  return (
    <>
      {renderChart}
      <ChartTooltip
        ref={tooltipRef}
        dataPoints={tooltipData}
        onMouseEnter={() => {
          isHovered.current = true;
        }}
        onMouseLeave={hideTooltip}
      />
    </>
  );
};

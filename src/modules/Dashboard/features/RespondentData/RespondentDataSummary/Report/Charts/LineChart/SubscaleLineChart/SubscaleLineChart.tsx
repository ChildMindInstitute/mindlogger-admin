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
import { useDatavizFilters } from 'modules/Dashboard/hooks';
import { SummaryFiltersForm } from 'modules/Dashboard/pages/RespondentData/RespondentData.types';

import { legendMargin } from '../../Charts.utils';
import { LINK_PATTERN, locales, TOOLTIP_OFFSET_LEFT, TOOLTIP_OFFSET_TOP } from '../../Charts.const';
import { StyledChartContainer } from '../../Chart.styles';
import { ChartTooltip } from './ChartTooltip';
import { getOptions, getData } from './SubscaleLineChart.utils';
import {
  SubscaleLineDataPointRaw,
  SubscaleLineChartProps,
  TooltipData,
} from './SubscaleLineChart.types';

ChartJS.register(Tooltip, TimeScale, Legend);

export const SubscaleLineChart = ({ data, versions }: SubscaleLineChartProps) => {
  const { i18n } = useTranslation('app');
  const chartRef = useRef<ChartJSOrUndefined<'line', SubscaleLineDataPointRaw[]> | null>(null);

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const isHovered = useRef(false);

  const [tooltipData, setTooltipData] = useState<TooltipData[] | null>(null);

  const { execute: getOptionText } = useAsync(getOptionTextApi);
  const { watch } = useFormContext<SummaryFiltersForm>();
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

    const tooltipsPoint = dataPoints.filter((point) => point.dataset.xAxisID === 'x');

    if (chart && tooltipsPoint.length) {
      const tooltipDataPoints = await Promise.all(
        tooltipsPoint.map(async (dataPoint) => {
          let optionText = (dataPoint.raw as SubscaleLineDataPointRaw).optionText;

          if (optionText && optionText.match(LINK_PATTERN)) {
            optionText = (await getOptionText(optionText)).data;
          }

          return {
            date: (dataPoint.raw as SubscaleLineDataPointRaw).x,
            backgroundColor: dataPoint.dataset.backgroundColor as string,
            label: dataPoint.dataset.label as string,
            value: (dataPoint.raw as SubscaleLineDataPointRaw).y,
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
      <StyledChartContainer>{renderChart}</StyledChartContainer>
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

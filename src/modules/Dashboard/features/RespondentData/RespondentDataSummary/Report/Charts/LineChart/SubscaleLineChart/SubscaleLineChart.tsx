import { useMemo, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Chart as ChartJS, Tooltip, TimeScale, Legend, ScriptableTooltipContext } from 'chart.js';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { Box } from '@mui/material';

import { getOptionTextApi } from 'api';
import { useDatavizFilters } from 'modules/Dashboard/hooks';
import { SummaryFiltersForm } from 'modules/Dashboard/pages/RespondentData/RespondentData.types';
import { pluck } from 'shared/utils';

import { ChartTooltipContainer } from '../../ChartTooltipContainer';
import { getTicksData, legendMargin, setTooltipStyles } from '../../Charts.utils';
import { LINK_PATTERN, locales } from '../../Charts.const';
import { StyledChartContainer } from '../../Chart.styles';
import { ChartTooltip } from './ChartTooltip';
import { getOptions, getData } from './SubscaleLineChart.utils';
import {
  SubscaleLineDataPointRaw,
  SubscaleLineChartProps,
  TooltipData,
} from './SubscaleLineChart.types';
import { ChartType } from '../../Chart.types';

ChartJS.register(Tooltip, TimeScale, Legend);

const dataTestid = 'subscale-line-chart';

export const SubscaleLineChart = ({ data, versions }: SubscaleLineChartProps) => {
  const { i18n } = useTranslation('app');
  const chartRef = useRef<ChartJSOrUndefined<'line', SubscaleLineDataPointRaw[]> | null>(null);

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const isHovered = useRef(false);

  const [tooltipData, setTooltipData] = useState<TooltipData[] | null>(null);

  const { watch } = useFormContext<SummaryFiltersForm>();
  const { minDate, maxDate, filteredVersions } = useDatavizFilters(watch, versions);

  const responses = data.subscales.map((subscale) => subscale.activityCompletions);
  const scores = pluck(responses.flat(), 'score');
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const { min, max, stepSize, height } = getTicksData(minScore, maxScore);

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
            optionText = (await getOptionTextApi(optionText)).data;
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
      const {
        element: { x: positionX, y: positionY },
      } = tooltipsPoint[0];
      setTooltipStyles({ chartType: ChartType.SubscaleLineChart, tooltipEl, positionX, positionY });
    }
  };

  const renderChart = useMemo(
    () => (
      <Line
        ref={chartRef}
        options={getOptions(lang, minDate, maxDate, tooltipHandler, min, max, stepSize)}
        data={getData(data, filteredVersions, max)}
        plugins={[ChartDataLabels, legendMargin]}
      />
    ),
    [lang, minDate, maxDate, filteredVersions],
  );

  return (
    <Box sx={{ position: 'relative' }} data-testid={dataTestid}>
      <StyledChartContainer sx={{ height: `${height}px` }}>{renderChart}</StyledChartContainer>
      <ChartTooltipContainer
        ref={tooltipRef}
        onMouseEnter={() => {
          isHovered.current = true;
        }}
        onMouseLeave={hideTooltip}
        data-testid={dataTestid}
      >
        <ChartTooltip dataPoints={tooltipData} data-testid={dataTestid} />
      </ChartTooltipContainer>
    </Box>
  );
};

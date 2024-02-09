import { useMemo, useRef, useState } from 'react';

import { Box } from '@mui/material';
import { Chart as ChartJS, Tooltip, TimeScale, ScriptableTooltipContext } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { useTranslation } from 'react-i18next';
import 'chartjs-adapter-date-fns';

import { ChartType } from '../../Chart.types';
import { locales } from '../../Charts.const';
import { setTooltipStyles } from '../../Charts.utils';
import { ChartTooltipContainer } from '../../ChartTooltipContainer';
import { ChartTooltip } from './ChartTooltip';
import { TimePickerDataPointRaw, TimePickerLineChartProps } from './TimePickerLineChart.types';
import { getOptions, getData } from './TimePickerLineChart.utils';

ChartJS.register(Tooltip, TimeScale);

export const TimePickerLineChart = ({
  color,
  minDate,
  maxDate,
  answers,
  versions,
  'data-testid': dataTestid,
}: TimePickerLineChartProps) => {
  const { i18n } = useTranslation('app');
  const chartRef = useRef<ChartJSOrUndefined<'line', TimePickerDataPointRaw[]> | null>(null);

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const isHovered = useRef(false);

  const [tooltipData, setTooltipData] = useState<TimePickerDataPointRaw[] | null>(null);

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
      setTooltipData(dataPoints.map(({ raw }) => raw as TimePickerDataPointRaw));
      const {
        element: { x: positionX, y: positionY },
      } = dataPoints[0];
      setTooltipStyles({
        chartType: ChartType.TimePickerLineChart,
        tooltipEl,
        positionX,
        positionY,
      });
    }
  };

  const renderChart = useMemo(
    () => (
      <Line
        ref={chartRef}
        options={getOptions(lang, minDate, maxDate, tooltipHandler)}
        data={getData({ answers, versions, color })}
        plugins={[ChartDataLabels]}
        height={120}
      />
    ),
    [answers, lang],
  );

  return (
    <Box sx={{ position: 'relative' }} data-testid={dataTestid}>
      {renderChart}
      <ChartTooltipContainer
        ref={tooltipRef}
        onMouseEnter={() => {
          isHovered.current = true;
        }}
        onMouseLeave={hideTooltip}
        data-testid={dataTestid}
      >
        <ChartTooltip data={tooltipData} data-testid={dataTestid} />
      </ChartTooltipContainer>
    </Box>
  );
};

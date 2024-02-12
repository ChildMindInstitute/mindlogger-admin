import { Chart as ChartJS } from 'chart.js/dist/types';

import {
  CustomLegend,
  ScatterChartTooltipHandler,
  ChartType,
  SetTooltipStyles,
} from './Chart.types';
import {
  LEGEND_HEIGHT,
  MAX_LABEL_CHARS_Y,
  MAX_TICKS_COUNT,
  MIN_TICKS_COUNT,
  MS_PER_DAY,
  MS_PER_HOUR,
  POINT_RADIUS_DEFAULT,
  POINT_RADIUS_SECONDARY,
  TICK_HEIGHT,
} from './Charts.const';

export const truncateString = (label: string) =>
  label?.length > MAX_LABEL_CHARS_Y ? `${label.substring(0, MAX_LABEL_CHARS_Y)}...` : label;

export const getTimeConfig = (minMs: number, maxMs: number) => {
  const msDiff = maxMs - minMs;
  const days = msDiff / MS_PER_DAY;

  if (days > 2) {
    return {
      type: 'time' as const,
      time: {
        unit: 'day' as const,
        displayFormats: {
          month: 'MMM d' as const,
        },
      },
    };
  }

  const hours = msDiff / MS_PER_HOUR;
  const unit = hours > 3 ? ('hour' as const) : ('minute' as const);

  return {
    type: 'time' as const,
    time: {
      unit,
      displayFormats: {
        hour: 'MMM d, H:mm' as const,
      },
    },
  };
};

export const getTimelineStepSize = (minMs: number, maxMs: number) => {
  const msDiff = maxMs - minMs;
  const days = msDiff / MS_PER_DAY;
  if (days > 365) return 21; // step is 21d
  if (days > 180) return 14;
  if (days > 30) return 7;
  if (days > 21) return 5;
  if (days > 10) return 2;
  if (days > 2) return 1;

  const hours = msDiff / MS_PER_HOUR;
  if (hours > 12) return 6; // step is 6h
  if (hours > 3) return 1;

  return 15; // step is 15m
};

export const legendMargin = {
  id: 'legendMargin',
  beforeInit: (chart: ChartJS) => {
    const originalFit = (chart.legend as CustomLegend)?.fit;
    (chart.legend as CustomLegend).fit = function fit() {
      originalFit.bind(chart.legend)();
      this.height += 42;
    };
  },
};

export const setTooltipStyles = ({
  chartType,
  tooltipEl,
  positionX,
  positionY,
}: SetTooltipStyles) => {
  const POINT_RADIUS =
    chartType === ChartType.SubscaleLineChart ? POINT_RADIUS_SECONDARY : POINT_RADIUS_DEFAULT;
  const VERTICAL_OFFSET = POINT_RADIUS - 0.6;
  tooltipEl.style.display = 'block';
  tooltipEl.style.top = `${positionY + VERTICAL_OFFSET}px`;
  tooltipEl.style.left = `${positionX}px`;
};

export const scatterChartTooltipHandler = ({
  context,
  tooltipRef,
  isHovered,
  chartRef,
  setTooltipData,
  chartType,
}: ScatterChartTooltipHandler) => {
  if (context.tooltip.dataPoints?.find((dataPoint) => dataPoint.dataset.xAxisID === 'x2')) return; // hide the tooltip for version axis
  const tooltipEl = tooltipRef.current;

  if (!tooltipEl) return;

  const { tooltip } = context;
  const { dataPoints } = tooltip;

  if (!tooltip.opacity && !isHovered.current) {
    tooltipEl.style.display = 'none';

    return;
  }

  const chart = chartRef.current;

  if (chart) {
    setTooltipData(chartType === ChartType.ScatterChart ? dataPoints[0] : dataPoints);
    const {
      element: { x: positionX, y: positionY },
    } = dataPoints[0];
    setTooltipStyles({ chartType, tooltipEl, positionX, positionY });
  }
};

const getLength = (minScore: number, maxScore: number) => {
  if (minScore > 0 && maxScore > 0) {
    return Math.ceil(maxScore);
  }
  if (minScore < 0 && maxScore < 0) {
    return Math.abs(Math.floor(minScore));
  }

  return Math.ceil(maxScore) + Math.abs(Math.floor(minScore));
};

export const getTicksData = (minScore: number, maxScore: number) => {
  const length = getLength(minScore, maxScore);

  const ticks = (length < MAX_TICKS_COUNT ? MIN_TICKS_COUNT : MAX_TICKS_COUNT) - 1;

  const stepSize = Math.ceil(length / ticks);

  const min = minScore < 0 ? Math.floor(minScore) : 0;
  const max =
    stepSize * (length < MAX_TICKS_COUNT ? MIN_TICKS_COUNT : MAX_TICKS_COUNT) +
    (minScore < 0 ? Math.floor(minScore) : 0);

  return {
    min,
    max,
    stepSize,
    height: (ticks + 1) * TICK_HEIGHT + LEGEND_HEIGHT, // +1 to include version tick
  };
};

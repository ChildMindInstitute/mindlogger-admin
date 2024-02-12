import { Dispatch, MutableRefObject, SetStateAction } from 'react';

import { ChartTypeRegistry, LegendElement, ScriptableTooltipContext } from 'chart.js';
import { TooltipItem } from 'chart.js/dist/types';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

export type CustomLegend = LegendElement<keyof ChartTypeRegistry> & {
  fit: () => void;
};

export type SetTooltipStyles = {
  chartType: ChartType;
  tooltipEl: HTMLDivElement;
  positionX: number;
  positionY: number;
};

type ScatterTooltipData = TooltipItem<'scatter'>;

type MultiScatterTooltipData = TooltipItem<'scatter'>[];

type TooltipDataAction = ScatterTooltipData | MultiScatterTooltipData | null;

export type SetTooltipData = Dispatch<SetStateAction<TooltipDataAction>>;

export enum ChartType {
  ScatterChart,
  MultiScatterChart,
  BarChart,
  SubscaleLineChart,
  TimePickerLineChart,
}

export type ScatterChartTooltipHandler = {
  context: ScriptableTooltipContext<'scatter'>;
  tooltipRef: MutableRefObject<HTMLDivElement | null>;
  isHovered: MutableRefObject<boolean>;
  chartRef: MutableRefObject<ChartJSOrUndefined<
    'scatter',
    { x: Date; y: number }[],
    unknown
  > | null>;
  setTooltipData: SetTooltipData;
  chartType: ChartType;
};

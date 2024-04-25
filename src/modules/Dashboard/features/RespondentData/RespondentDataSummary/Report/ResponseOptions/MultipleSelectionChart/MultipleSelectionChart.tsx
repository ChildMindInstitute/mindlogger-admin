import {
  SingleMultiSelectionSliderAnswer,
  NumberSelectionAnswer,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';

import { TICK_HEIGHT } from '../../Charts/Charts.const';
import { MultiScatterChart } from '../../Charts';
import { MultipleSelectionChartProps } from './MultipleSelectionChart.types';

export const MultipleSelectionChart = ({
  responseType,
  color,
  minDate,
  maxDate,
  activityItemAnswer,
  versions,
  options,
  isStaticActive,
}: MultipleSelectionChartProps) => {
  const answers = activityItemAnswer.answers as (
    | SingleMultiSelectionSliderAnswer
    | NumberSelectionAnswer
  )[];
  const height = (options.length + 1) * TICK_HEIGHT;
  const values = options.map(({ value }) => value);
  const minY = Math.min(...values);
  const maxY = Math.max(...values);

  return (
    <MultiScatterChart
      color={color}
      minDate={minDate}
      maxDate={maxDate}
      minY={minY}
      maxY={maxY}
      height={height}
      options={options}
      responseType={responseType}
      answers={answers}
      versions={versions}
      data-testid={`${activityItemAnswer.dataTestid}-multi-scatter-chart`}
      isStaticActive={isStaticActive}
    />
  );
};

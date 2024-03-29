import { ItemResponseType } from 'shared/consts';
import {
  DateAnswer,
  FormattedActivityItem,
  ItemOption,
  NumberSelectionAnswer,
  NumberSelectionResponseValues,
  SingleMultiSelectionPerRowAnswer,
  SingleMultiSelectionPerRowItemResponseValues,
  SingleMultiSelectionSliderAnswer,
  SingleMultiSelectionSliderItemResponseValues,
  TextAnswer,
  TimeAnswer,
  TimeRangeAnswer,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';

import { TICK_HEIGHT } from '../Charts/Charts.const';
import { MultiScatterChart } from '../Charts/MultiScatterChart';
import { TimePickerLineChart } from '../Charts/LineChart/TimePickerLineChart';
import { ReportTable } from '../ReportTable';
import { GetResponseOptionsProps } from './ResponseOptions.types';
import { SingleSelectionPerRow } from './SingleSelectionPerRow';

export const getResponseItem = ({
  color,
  minDate,
  maxDate,
  versions,
  activityItemAnswer,
}: GetResponseOptionsProps) => {
  const responseType = activityItemAnswer.activityItem.responseType;

  const renderMultipleSelection = (options: ItemOption[]) => {
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
      />
    );
  };

  switch (responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
    case ItemResponseType.Slider: {
      const { options } = activityItemAnswer.activityItem
        .responseValues as SingleMultiSelectionSliderItemResponseValues;

      return renderMultipleSelection(options);
    }
    case ItemResponseType.NumberSelection: {
      const { minValue, maxValue } = activityItemAnswer.activityItem
        .responseValues as NumberSelectionResponseValues;
      const min = Number(minValue ?? 0);
      const max = Number(maxValue ?? 0);
      const options = Array.from({ length: max - min + 1 }, (_, i) => {
        const value = i + min;

        return {
          id: String(value),
          text: value,
          value,
        } as ItemOption;
      });

      return renderMultipleSelection(options);
    }
    case ItemResponseType.TimeRange:
    case ItemResponseType.Date:
    case ItemResponseType.Text:
      return (
        <ReportTable
          responseType={responseType}
          answers={activityItemAnswer.answers as (TimeRangeAnswer | DateAnswer | TextAnswer)[]}
          data-testid={activityItemAnswer.dataTestid}
        />
      );
    case ItemResponseType.Time:
      return (
        <TimePickerLineChart
          color={color}
          minDate={minDate}
          maxDate={maxDate}
          answers={activityItemAnswer.answers as TimeAnswer[]}
          versions={versions}
          data-testid={`${activityItemAnswer.dataTestid}-time-picker-chart`}
        />
      );
    case ItemResponseType.SingleSelectionPerRow:
    case ItemResponseType.MultipleSelectionPerRow:
      return (
        <SingleSelectionPerRow
          color={color}
          minDate={minDate}
          maxDate={maxDate}
          activityItem={
            activityItemAnswer.activityItem as FormattedActivityItem<SingleMultiSelectionPerRowItemResponseValues>
          }
          answers={activityItemAnswer.answers as SingleMultiSelectionPerRowAnswer}
          versions={versions}
          data-testid={activityItemAnswer.dataTestid}
        />
      );
    default:
      <></>;
  }
};

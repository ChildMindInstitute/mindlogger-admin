import { ItemResponseType } from 'shared/consts';
import {
  DateAnswer,
  FormattedActivityItem,
  ItemOption,
  NumberSelectionItemResponseValues,
  SingleMultiSelectionPerRowAnswer,
  SingleMultiSelectionPerRowItemResponseValues,
  SingleMultiSelectionSliderItemResponseValues,
  SliderRowsItemResponseValues,
  SliderRowsAnswer,
  TextAnswer,
  TimeAnswer,
  TimeRangeAnswer,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';

import { TimePickerLineChart } from '../Charts/LineChart/TimePickerLineChart';
import { ReportTable } from '../ReportTable';
import { GetResponseOptionsProps } from './ResponseOptions.types';
import { SelectionPerRow } from './SelectionPerRow';
import { SliderRows } from './SliderRows';
import { MultipleSelectionChart } from './MultipleSelectionChart';

export const getResponseItem = ({
  color,
  minDate,
  maxDate,
  versions,
  activityItemAnswer,
  isStaticActive = false,
}: GetResponseOptionsProps) => {
  const responseType = activityItemAnswer.activityItem.responseType;

  switch (responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
    case ItemResponseType.Slider: {
      const { options } = activityItemAnswer.activityItem
        .responseValues as SingleMultiSelectionSliderItemResponseValues;

      return (
        <MultipleSelectionChart
          responseType={responseType}
          color={color}
          minDate={minDate}
          maxDate={maxDate}
          activityItemAnswer={activityItemAnswer}
          versions={versions}
          options={options}
          isStaticActive={isStaticActive}
        />
      );
    }
    case ItemResponseType.NumberSelection: {
      const { minValue, maxValue } = activityItemAnswer.activityItem
        .responseValues as NumberSelectionItemResponseValues;
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

      return (
        <MultipleSelectionChart
          responseType={responseType}
          color={color}
          minDate={minDate}
          maxDate={maxDate}
          activityItemAnswer={activityItemAnswer}
          versions={versions}
          options={options}
          isStaticActive={isStaticActive}
        />
      );
    }
    case ItemResponseType.TimeRange:
    case ItemResponseType.Date:
    case ItemResponseType.Text:
    case ItemResponseType.ParagraphText:
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
          isStaticActive={isStaticActive}
          data-testid={`${activityItemAnswer.dataTestid}-time-picker-chart`}
        />
      );
    case ItemResponseType.SingleSelectionPerRow:
    case ItemResponseType.MultipleSelectionPerRow:
      return (
        <SelectionPerRow
          color={color}
          minDate={minDate}
          maxDate={maxDate}
          activityItem={
            activityItemAnswer.activityItem as FormattedActivityItem<SingleMultiSelectionPerRowItemResponseValues>
          }
          answers={activityItemAnswer.answers as SingleMultiSelectionPerRowAnswer}
          versions={versions}
          isStaticActive={isStaticActive}
          data-testid={activityItemAnswer.dataTestid}
        />
      );
    case ItemResponseType.SliderRows:
      return (
        <SliderRows
          color={color}
          minDate={minDate}
          maxDate={maxDate}
          activityItem={
            activityItemAnswer.activityItem as FormattedActivityItem<SliderRowsItemResponseValues>
          }
          answers={activityItemAnswer.answers as SliderRowsAnswer}
          versions={versions}
          isStaticActive={isStaticActive}
          data-testid={activityItemAnswer.dataTestid}
        />
      );

    default:
      <></>;
  }
};

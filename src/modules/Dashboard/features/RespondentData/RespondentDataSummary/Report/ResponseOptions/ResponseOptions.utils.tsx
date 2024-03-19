import { ItemResponseType } from 'shared/consts';

import { TICK_HEIGHT } from '../Charts/Charts.const';
import { MultiScatterChart } from '../Charts/MultiScatterChart';
import { TimePickerLineChart } from '../Charts/LineChart/TimePickerLineChart';
import { ReportTable } from '../ReportTable';
import { GetResponseOptionsProps } from './ResponseOptions.types';
import { ItemOption, NumberSelectionResponseValues } from '../Report.types';

export const getResponseItem = ({
  color,
  minDate,
  maxDate,
  activityItem,
  versions,
  answers = [],
  dataTestid,
}: GetResponseOptionsProps) => {
  const responseType = activityItem.responseType;

  const renderMultipleSelection = (options: ItemOption[]) => {
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
        data-testid={`${dataTestid}-multi-scatter-chart`}
      />
    );
  };

  const renderTimePicker = () => (
    <TimePickerLineChart
      color={color}
      minDate={minDate}
      maxDate={maxDate}
      answers={answers}
      versions={versions}
      data-testid={`${dataTestid}-time-picker-chart`}
    />
  );

  switch (responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
    case ItemResponseType.Slider: {
      const { options } = activityItem.responseValues;

      return renderMultipleSelection(options);
    }
    case ItemResponseType.NumberSelection: {
      const { minValue, maxValue } = activityItem.responseValues as NumberSelectionResponseValues;
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
    case ItemResponseType.Date:
    case ItemResponseType.Text:
      return <ReportTable answers={answers} data-testid={dataTestid} />;
    case ItemResponseType.Time:
      return renderTimePicker();
    default:
      <></>;
  }
};

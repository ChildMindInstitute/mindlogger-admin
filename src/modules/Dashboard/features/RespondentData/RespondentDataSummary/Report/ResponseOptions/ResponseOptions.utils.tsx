import { ItemResponseType } from 'shared/consts';

import { TimePickerLineChart } from '../Charts/LineChart';
import { TICK_HEIGHT } from '../Charts/Charts.const';
import { MultiScatterChart } from '../Charts';
import { ReportTable } from '../ReportTable';
import { GetResponseOptionsProps } from './ResponseOptions.types';

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

  const renderMultipleSelection = () => {
    const { options } = activityItem.responseValues;
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
        responseValues={activityItem.responseValues}
        responseType={responseType}
        answers={answers}
        versions={versions}
        data-testid={dataTestid}
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
      data-testid={dataTestid}
    />
  );

  switch (responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
    case ItemResponseType.Slider:
      return renderMultipleSelection();
    case ItemResponseType.Text:
      return <ReportTable answers={answers} data-testid={dataTestid} />;
    case ItemResponseType.Time:
      return renderTimePicker();
    default:
      <></>;
  }
};

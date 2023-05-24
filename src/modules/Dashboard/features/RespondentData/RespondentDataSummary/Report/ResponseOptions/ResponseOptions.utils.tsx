import { ItemResponseType } from 'shared/consts';
import {
  SingleAndMultipleSelectItemResponseValues,
  SliderItemResponseValues,
} from 'shared/state/Applet/Applet.schema';

import { ItemAnswer, FormattedItemAnswer } from '../Report.types';
import { MultiScatterChart } from '../Charts';
import { ReportTable } from '../ReportTable';
import { GetResponseOptionsProps, MultiScatterResponseValues } from './ResponseOptions.types';
import { TICK_HEIGHT } from './ResponseOptions.const';

export const formatAnswers = (answers: ItemAnswer[]) =>
  answers.reduce((flattenAnswers: FormattedItemAnswer[], { value, date }: ItemAnswer) => {
    if (Array.isArray(value)) {
      const flattenValues = value.map((item) => ({ value: item, date }));

      return [...flattenAnswers, ...flattenValues];
    }

    return [...flattenAnswers, { value, date }];
  }, []);

export const getResponseItem = ({
  minDate,
  maxDate,
  activityItem,
  versions,
  answers = [],
}: GetResponseOptionsProps) => {
  const responseType = activityItem.responseType;

  const renderSingleMultipleSelection = () => {
    const formattedAnswers = formatAnswers(answers);
    const { options } = activityItem.responseValues as SingleAndMultipleSelectItemResponseValues;
    const height = (options.length + 1) * TICK_HEIGHT;
    const maxY = options.length;

    return (
      <MultiScatterChart
        minDate={minDate}
        maxDate={maxDate}
        maxY={maxY}
        height={height}
        responseValues={activityItem.responseValues as MultiScatterResponseValues}
        responseType={responseType}
        answers={formattedAnswers}
        versions={versions}
      />
    );
  };

  const renderSlider = () => {
    const { minValue, maxValue } = activityItem.responseValues as SliderItemResponseValues;
    const height = (maxValue - minValue + 1) * TICK_HEIGHT;

    return (
      <MultiScatterChart
        minDate={minDate}
        maxDate={maxDate}
        maxY={maxValue}
        minY={minValue}
        height={height}
        responseValues={activityItem.responseValues as MultiScatterResponseValues}
        responseType={responseType}
        answers={answers as FormattedItemAnswer[]}
        versions={versions}
      />
    );
  };

  switch (responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
      return renderSingleMultipleSelection();
    case ItemResponseType.Slider:
      return renderSlider();
    case ItemResponseType.Text:
      return <ReportTable answers={answers} />;
    default:
      <></>;
  }
};
